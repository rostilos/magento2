<?php
namespace Roadmap\RegisterCheckout\Controller\Index;

use Magento\Framework\App\Action\Action;
use Magento\Framework\Controller\ResultFactory;
use Magento\Customer\Model\Customer;
use Magento\Framework\Controller\Result\JsonFactory;


class Check extends Action
{
    /**
     * @var JsonFactory
     */
    protected $resultJsonFactory;

    /**
     * @var Customer
     */
    protected $_customerModel;

    /**
     * @var ResultFactory
     */
    protected $resultFactory;

    /**
     * @param \Magento\Framework\App\Action\Context $context
     */
    public function __construct(
        \Magento\Framework\App\Action\Context $context,
        JsonFactory $resultJsonFactory,
        Customer $customerModel,
        ResultFactory $resultFactory,
    ) {
        $this->resultJsonFactory = $resultJsonFactory;
        $this->_customerModel = $customerModel;
        $this->resultFactory = $resultFactory;
        parent::__construct($context);
    }

    public function execute()
    {
        $resultJson = $this->resultJsonFactory->create();
        $email = $this->getRequest()->getParam('email');
        $customerData = $this->_customerModel
            ->getCollection()
            ->addFieldToFilter('email', $email);

        if (!count($customerData)) {
            return $resultJson->setData('true');
        } else {
            return $resultJson->setData('A user with this email has already registered');
        }
    }
}
