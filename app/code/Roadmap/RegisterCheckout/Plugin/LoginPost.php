<?php

namespace Roadmap\RegisterCheckout\Plugin;

use Magento\Framework\Controller\ResultFactory;
use Magento\Framework\UrlInterface;

class LoginPost
{
    /**
     * @var ResultFactory
     */
    protected $resultFactory;

    /**
     * @var UrlInterface
     */
    protected $url;

    public function __construct(
        UrlInterface $url,
        ResultFactory $resultFactory,
    ) {
        $this->url = $url;
        $this->resultFactory = $resultFactory;
    }

    public function afterExecute(
        \Magento\Customer\Controller\Account\LoginPost $subject,
        $result)
    {
        if (isset($_POST['checkout']) && $_POST['checkout'] == 'true') {
            $result = $this->resultFactory->create(
                ResultFactory::TYPE_REDIRECT
            );
            $result->setUrl($this->url->getUrl('checkout'));
        }

        return $result;
    }

}