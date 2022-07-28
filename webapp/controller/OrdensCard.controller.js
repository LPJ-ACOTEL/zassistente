sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",

], function(Controller, JSONModel) {
	"use strict";

	return Controller.extend("com.assistente.controller.OrdensCard", {

		onInit: function() {

			//Mime Model
			var oRootPath = jQuery.sap.getModulePath("com.assistente");
			var oImageModel = new sap.ui.model.json.JSONModel({
				path: oRootPath
			});
			this.getView().setModel(oImageModel, "imageModel");
			this.getOwnerComponent().getRouter().getRoute("ordenscards").attachPatternMatched(this._routeMatched, this);

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

		actionCotacao: function() {
			//this.getOwnerComponent().getRouter().navTo("cotacao");
			this.getOwnerComponent().getRouter().navTo("cotacao", {
				Id: "0"
			});
		},

		actionOrdem: function() {
			this.getOwnerComponent().getRouter().navTo("ordem", {
				Id: "0"
			});
		},

		actionAdministrar: function() {

			var oModel = new JSONModel();
			var oData = {};
			oData = "X";
			oModel.setData(oData);

			sap.ui.getCore().setModel(oModel, "ModelIniti");

			this.getOwnerComponent().getRouter().navTo("administracotacao");
		},

		actionMonitorNfe: function() {

			var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");

			var hash = (oCrossAppNavigator && oCrossAppNavigator.hrefForExternal({
				target: {
					semanticObject: "J1BNFE",
					action: "display"
				},
			})) || ""; // generate the Hash to display
			//  oCrossAppNavigator.toExternal({
			// target: {
			//shellHash: hash
			//}
			//}
			//);

			var url = window.location.href.split('#')[0] + hash;
			//Navigate to second app
			sap.m.URLHelper.redirect(url, true);

		},

		onAfterRendering: function() {
			try {
				sap.ui.controller("com.assistente.controller.Inicio").authControl();
				let modelUsuario = this.getOwnerComponent().getModel("usuario").getData();
				this.byId("idUsuario").setText(modelUsuario.getId());
				this.byId("nomeUsuario").setText(modelUsuario.getFirstName());
				this.byId("nomeLoja").setText(sap.ui.getCore().getModel("centroloja").getData()[0].loja);
			} catch {

			};
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