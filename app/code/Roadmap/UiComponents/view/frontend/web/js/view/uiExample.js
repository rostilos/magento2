define(['uiComponent', 'ko', 'collapsible'], function(uiComponent, ko) {
    'use strict';

// require('uiRegistry')
// require('uiRegistry').get('example').name;
// require('uiRegistry').set('example', {...});
// require('uiRegistry').remove('componentName')

    return uiComponent.extend({
        defaults: {
            template: 'Roadmap_UiComponents/example',
            text: 'test',
            email: '123',
            lileralExample: '${ $.text}',

            statefull: {
                email: true
            },
            // es5 observe
            tracks: {
                text: true,
                email: true,
                lileralExample: true,
            },
            // exports: {
            //     email: "exports:email",
            // },
        },

        // functional observe
        // initObservable(){
        //     this._super();
            
            // this.observe('text');

            // return this;
        // },

        initialize() {
            this._super();

            setTimeout(() => {
                // functional observe
                // this.text('upd');
                
                // es5 observe
                this.text = 'upd';
            },2000)
        },

    });
})