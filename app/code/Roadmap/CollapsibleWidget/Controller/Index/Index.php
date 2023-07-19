<?php

namespace Roadmap\CollapsibleWidget\Controller\Index;

use Magento\Framework\App\Action\Action;
use Magento\Framework\App\Action\Context;
use Magento\Framework\Controller\Result\RawFactory;
use Magento\Framework\View\Result\PageFactory;


class Index extends Action
{

    /**
     * @var RawFactory
     */
    protected $resultRawFactory;

    /**
     * @var PageFactory
     */
    protected $resultPageFactory;


    public function __construct(
        RawFactory $resultRawFactory,
        PageFactory $resultPageFactory, 
        Context $context
        )
    {
        $this->resultPageFactory = $resultPageFactory;
        $this->resultRawFactory = $resultRawFactory;
        parent::__construct($context);
    }

    public function execute()
    {
        $result = $this->resultRawFactory->create();

        $result->setContents('
        <div style="margin-left:10px" class="collapsible" data-mage-init=\'{
            "collapsible":{
                "collapsible": true,
                "openedState": "active",
                "active": true,
                "saveState": true
            }}\'>
        
            <div class="collapsible__title" data-role="title" class="button" style="display:flex; align-items: center;" >
                <h4>Loaded from AJAX</h4>
                <p class="collapsible__trigger" data-role="trigger">
                    <svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 4L12 20M12 20L18 14M12 20L6 14" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </p>
            </div>
            
            <div data-role="content">
                <ul>
                    <li>1</li>
                    <li>2</li>
                    <li>3</li>
                </ul>
            </div>
        </div>
        ');
        return $result;

    }
    // public function execute()
    // {
    //     return $resultPage = $this->resultPageFactory->create();
    // }
}