sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/Device",
    "com/assistente/model/models",
    "com/assistente/controller/ListSelector"
],
function (UIComponent, Device, models, ListSelector) {
    "use strict";

    return UIComponent.extend("com.assistente.Component", {
        metadata: {
            manifest: "json"
        },

        /**
         * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
         * @public
         * @override
         */
        init: function () {

            this.oListSelector = new ListSelector();

            // call the base component's init function
            UIComponent.prototype.init.apply(this, arguments);

            try {
                var oUser = sap.ui2.shell.getUser();
                var oThis = this;

                oUser.load({}, () => {
                    let oUserModel = new sap.ui.model.json.JSONModel();
                    oUserModel.setData(oUser);
                    oThis.setModel(oUserModel, "usuario");
                }, () => {
                    alert('Erro ao obter dados do usuário.');
                });
            } catch {

            };

            // enable routing
            this.getRouter().initialize();

            // set the device model
            this.setModel(models.createDeviceModel(), "device");
        },

        getContentDensityClass: function () {

            if (this._sContentDensityClass === undefined) {
                // check whether FLP has already set the content density class; do nothing in this case
                if (jQuery(document.body).hasClass("sapUiSizeCozy") || jQuery(document.body).hasClass("sapUiSizeCompact")) {
                    this._sContentDensityClass = "";
                } else if (!Device.support.touch) { // apply "compact" mode if touch is not supported
                    this._sContentDensityClass = "sapUiSizeCompact";
                } else {
                    // "cozy" in case of touch support; default for most sap.m controls, but needed for desktop-first controls like sap.ui.table.Table
                    this._sContentDensityClass = "sapUiSizeCozy";
                }
            }
            return this._sContentDensityClass;
        },

        destroy: function () {
            this.oListSelector.destroy();
            //this._oErrorHandler.destroy();
            // call the base component's destroy function
            UIComponent.prototype.destroy.apply(this, arguments);
        },

    });
}
);