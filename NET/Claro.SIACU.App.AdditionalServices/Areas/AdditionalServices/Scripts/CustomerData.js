(function ($, undefined) {

    'use strict';

    var Form = function ($element, options) {
        $.extend(this, $.fn.customerData.defaults, $element.data(), typeof options === 'object' && options);

        this.setControls({
            form: $element,
            //Information Customer
            spnCustomerName: $('#spnCustomerName', $element),
            spnContactName: $('#spnContactName', $element),
            spnNumberContract: $('#spnNumberContract', $element),
            spnDateActivation: $('#spnDateActivation', $element),
            spnLegalRepresentative: $('#spnLegalRepresentative', $element),
            spnDocLegalRepresentative: $('#spnDocLegalRepresentative', $element),
            spnDocCustomer: $('#spnDocCustomer', $element),
            spnCustomerID: $('#spnCustomerID', $element),
            spnTypeCustomer: $('#spnTypeCustomer', $element),
            spnCycleFacture: $('#spnCycleFacture', $element),
            spnNumberPhone1: $('#spnNumberPhone1', $element),
            spnNumberPhone2: $('#spnNumberPhone2', $element)
        });
    }

    Form.prototype = {
        constructor: Form,

        init: function () {
            var that = this,
                controls = this.getControls();

            that.render();
        },

        loadCustomerInformation: function () {
            var that = this;
            var controls = that.getControls();
            controls.spnCustomerName.text(Session.SessionParams.DATACUSTOMER.FullName);
            controls.spnContactName.text(Session.SessionParams.DATACUSTOMER.CustomerContact);
            controls.spnNumberContract.text(Session.SessionParams.DATACUSTOMER.ContractID);
            controls.spnDateActivation.text(Session.SessionParams.DATACUSTOMER.ActivationDate);
            controls.spnLegalRepresentative.text(Session.SessionParams.DATACUSTOMER.LegalAgent);
            controls.spnDocLegalRepresentative.text(Session.SessionParams.DATACUSTOMER.DocumentType);
            controls.spnDocCustomer.text(Session.SessionParams.DATACUSTOMER.DocumentNumber);
            controls.spnCustomerID.text(Session.SessionParams.DATACUSTOMER.CustomerID);
            controls.spnTypeCustomer.text(Session.SessionParams.DATACUSTOMER.CustomerType);
            controls.spnCycleFacture.text(Session.SessionParams.DATACUSTOMER.BillingCycle);
        },

        render: function () {
            var that = this,
                controls = this.getControls();
            that.loadCustomerInformation();
        },

        getControls: function () {
            return this.m_controls || {};
        },

        setControls: function (value) {
            this.m_controls = value;
        }
    }

    $.fn.customerData = function () {
        var option = arguments[0],
            args = arguments,
            value,
            allowedMethods = [];

        this.each(function () {
            var $this = $(this),
                data = $this.data('customerData'),
                options = $.extend({}, $.fn.customerData.defaults,
                    $this.data(), typeof option === 'object' && option);

            if (!data) {
                data = new Form($this, options);
                $this.data('customerData', data);
            }

            if (typeof option === 'string') {
                if ($.inArray(option, allowedMethods) < 0) {
                    throw "Unknown method: " + option;
                }
                value = data[option](args[1]);
            } else {
                data.init();
                if (args[1]) {
                    value = data[args[1]].apply(data, [].slice.call(args, 2));
                }
            }
        });

        return value || this;
    };

    $.fn.customerData.defaults = {
    }

    $('#divCustomerData').customerData();

})(jQuery, null);