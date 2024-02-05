<?php
/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */
declare(strict_types=1);

namespace Magento\Framework\Mail;

use Laminas\Mail\Exception\InvalidArgumentException as LaminasInvalidArgumentException;
use Magento\Framework\App\ObjectManager;
use Magento\Framework\Mail\Exception\InvalidArgumentException;
use Laminas\Mail\Address as LaminasAddress;
use Laminas\Mail\AddressList;
use Laminas\Mime\Message as LaminasMimeMessage;
use Psr\Log\LoggerInterface;

/**
 * Magento Framework Email message
 *
 * @SuppressWarnings(PHPMD.CouplingBetweenObjects)
 */
class EmailMessage extends Message implements EmailMessageInterface
{
    /**
     * @var array.
     */
    private const ARRAY_RCE_CHARACTERS = [
        ',',
        ';'
    ];

    /**
     * @var MimeMessageInterfaceFactory
     */
    private $mimeMessageFactory;

    /**
     * @var AddressFactory
     */
    private $addressFactory;

    /**
     * @var LoggerInterface|null
     */
    private $logger;

    /**
     * @param MimeMessageInterface $body
     * @param array $to
     * @param MimeMessageInterfaceFactory $mimeMessageFactory
     * @param AddressFactory $addressFactory
     * @param Address[]|null $from
     * @param Address[]|null $cc
     * @param Address[]|null $bcc
     * @param Address[]|null $replyTo
     * @param Address|null $sender
     * @param string|null $subject
     * @param string|null $encoding
     * @param LoggerInterface|null $logger
     * @throws InvalidArgumentException
     * @SuppressWarnings(PHPMD.ExcessiveParameterList)
     * @SuppressWarnings(PHPMD.NPathComplexity)
     * @SuppressWarnings(PHPMD.CyclomaticComplexity)
     */
    public function __construct(
        MimeMessageInterface $body,
        array $to,
        MimeMessageInterfaceFactory $mimeMessageFactory,
        AddressFactory $addressFactory,
        ?array $from = null,
        ?array $cc = null,
        ?array $bcc = null,
        ?array $replyTo = null,
        ?Address $sender = null,
        ?string $subject = '',
        ?string $encoding = 'utf-8',
        ?LoggerInterface $logger = null
    ) {
        parent::__construct($encoding);
        $mimeMessage = new LaminasMimeMessage();
        $this->logger = $logger ?: ObjectManager::getInstance()->get(LoggerInterface::class);
        $mimeMessage->setParts($body->getParts());
        $this->zendMessage->setBody($mimeMessage);
        if ($subject) {
            $this->zendMessage->setSubject($subject);
        }
        if ($sender) {
            $this->zendMessage->setSender(
                $this->sanitiseEmail($sender->getEmail()),
                $this->sanitiseName($sender->getName())
            );
        }
        if (count($to) < 1) {
            throw new InvalidArgumentException('Email message must have at least one addressee');
        }
        if ($to) {
            $this->zendMessage->setTo($this->convertAddressArrayToAddressList($to));
        }
        if ($replyTo) {
            $this->zendMessage->setReplyTo($this->convertAddressArrayToAddressList($replyTo));
        }
        if ($from) {
            $this->zendMessage->setFrom($this->convertAddressArrayToAddressList($from));
        }
        if ($cc) {
            $this->zendMessage->setCc($this->convertAddressArrayToAddressList($cc));
        }
        if ($bcc) {
            $this->zendMessage->setBcc($this->convertAddressArrayToAddressList($bcc));
        }
        $this->mimeMessageFactory = $mimeMessageFactory;
        $this->addressFactory = $addressFactory;
    }

    /**
     * @inheritDoc
     */
    public function getEncoding(): string
    {
        return $this->zendMessage->getEncoding();
    }

    /**
     * @inheritDoc
     */
    public function getHeaders(): array
    {
        return $this->zendMessage->getHeaders()->toArray();
    }

    /**
     * @inheritDoc
     *
     */
    public function getFrom(): ?array
    {
        return $this->convertAddressListToAddressArray($this->zendMessage->getFrom());
    }

    /**
     * @inheritDoc
     *
     */
    public function getTo(): array
    {
        return $this->convertAddressListToAddressArray($this->zendMessage->getTo());
    }

    /**
     * @inheritDoc
     *
     */
    public function getCc(): ?array
    {
        return $this->convertAddressListToAddressArray($this->zendMessage->getCc());
    }

    /**
     * @inheritDoc
     *
     */
    public function getBcc(): ?array
    {
        return $this->convertAddressListToAddressArray($this->zendMessage->getBcc());
    }

    /**
     * @inheritDoc
     *
     */
    public function getReplyTo(): ?array
    {
        return $this->convertAddressListToAddressArray($this->zendMessage->getReplyTo());
    }

    /**
     * @inheritDoc
     *
     */
    public function getSender(): ?Address
    {
        /** @var LaminasAddress $laminasSender */
        if (!$laminasSender = $this->zendMessage->getSender()) {
            return null;
        }
        return $this->addressFactory->create(
            [
                'email' => $this->sanitiseEmail($laminasSender->getEmail()),
                'name' => $this->sanitiseName($laminasSender->getName())
            ]
        );
    }

    /**
     * @inheritDoc
     */
    public function getMessageBody(): MimeMessageInterface
    {
        return $this->mimeMessageFactory->create(
            ['parts' => $this->zendMessage->getBody()->getParts()]
        );
    }

    /**
     * @inheritDoc
     */
    public function getBodyText(): string
    {
        return $this->zendMessage->getBodyText();
    }

    /**
     * @inheritDoc
     */
    public function toString(): string
    {
        return $this->zendMessage->toString();
    }

    /**
     * Converts AddressList to array
     *
     * @param AddressList $addressList
     * @return Address[]
     */
    private function convertAddressListToAddressArray(AddressList $addressList): array
    {
        $arrayList = [];
        foreach ($addressList as $address) {
            $arrayList[] =
                $this->addressFactory->create(
                    [
                        'email' => $this->sanitiseEmail($address->getEmail()),
                        'name' => $this->sanitiseName($address->getName())
                    ]
                );
        }

        return $arrayList;
    }

    /**
     * Converts MailAddress array to AddressList
     *
     * @param Address[] $arrayList
     * @return AddressList
     * @throws LaminasInvalidArgumentException
     */
    private function convertAddressArrayToAddressList(array $arrayList): AddressList
    {
        $laminasAddressList = new AddressList();
        foreach ($arrayList as $address) {
            try {
                $laminasAddressList->add(
                    $this->sanitiseEmail($address->getEmail()),
                    $this->sanitiseName($address->getName())
                );
            } catch (LaminasInvalidArgumentException $e) {
                $this->logger->warning(
                    'Could not add an invalid email address to the mailing queue',
                    ['exception' => $e]
                );
                continue;
            }
        }

        return $laminasAddressList;
    }

    /**
     * Sanitise email address
     *
     * @param ?string $email
     * @return ?string
     */
    private function sanitiseEmail(?string $email): ?string
    {
        if (!empty($email) && str_contains($email, '=?')) {
            $decodedValue = trim(iconv_mime_decode($email, ICONV_MIME_DECODE_CONTINUE_ON_ERROR, 'UTF-8'));
            if ($this->isEncoded(trim($email), $decodedValue)) {
                $email = strtolower(str_replace('=22', '', $email));
            }
        }

        return $email;
    }

    /**
     * Sanitise sender name
     *
     * @param ?string $name
     * @return ?string
     */
    private function sanitiseName(?string $name): ?string
    {
        if (!empty($name)) {
            return trim(str_replace(
                self::ARRAY_RCE_CHARACTERS,
                '',
                $name
            ));
        }

        return $name;
    }

    /**
     * Check email is encoded
     *
     * @param string $originalEmail
     * @param string $decodedEmail
     * @return bool
     */
    private function isEncoded(string $originalEmail, string $decodedEmail): bool
    {
        return str_starts_with($originalEmail, '=?')
            && strlen($originalEmail) !== strlen($decodedEmail);
    }
}
