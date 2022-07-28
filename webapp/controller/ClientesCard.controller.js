sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(Controller) {
	"use strict";

	return Controller.extend("com.assistente.controller.ClientesCard", {

		actionCredito: function() {
			var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");

			var hash = (oCrossAppNavigator && oCrossAppNavigator.hrefForExternal({
				target: {
					semanticObject: "BusinessPartner",
					action: "displayCreditExposure"
				},
			})) || ""; // generate the Hash to display

			var url = window.location.href.split('#')[0] + hash;
			//Navigate to second app
			sap.m.URLHelper.redirect(url, true);
		},

		actionCredito1: function() {

			var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");
			var hash = (oCrossAppNavigator && oCrossAppNavigator.hrefForExternal({
				target: {
					semanticObject: "BusinessPartner",
					action: "displayCreditExposure"
				},
				params: {
					"BusinessPartner": "10" // Parameter Key & Value
				}
			})) || ""; // generate the Hash to display a Supplier
			oCrossAppNavigator.toExternal({
				target: {
					shellHash: hash
				}
			}); // navigate to Supplier application

			// Receive

			var startupParams = this.getOwnerComponent().getComponentData().startupParameters;
			if ((startupParams.BusinessPartner && startupParams.BusinessPartner[0])) { // Paramter Key
				
			}

		},

		onInit: function() {

			//Mime Model
			var oRootPath = jQuery.sap.getModulePath("com.assistente");
			var oImageModel = new sap.ui.model.json.JSONModel({
				path: oRootPath
			});
			this.getView().setModel(oImageModel, "imageModel");
			this.getOwnerComponent().getRouter().getRoute("clientescard").attachPatternMatched(this._routeMatched, this);

		},

		_routeMatched: function(oEvent) {

			this.getView().byId("nomeLoja").setVisible(true);
			var nameUser = sap.ui.getCore().getModel("usuarionome_loja");
			var user = sap.ui.getCore().getModel("usuario_loja");
			this.byId("idUsuario").setText(user);
			this.byId("nomeUsuario").setText(nameUser);

			var sLoja = sap.ui.getCore().getModel("nomeLoja");
			let nomeLoja = this.byId("nomeLoja");
			if (typeof sLoja != undefined) {
				nomeLoja.setText(sLoja);
			}

		},

		onPressMenuButton: function() {
			sap.ui.controller("com.acotel.controller.Inicio").onPressMenuButton();
		},

		onBack: function() {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("master");
		}

	});

});