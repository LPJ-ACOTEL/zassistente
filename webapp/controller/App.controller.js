sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast",
	"sap/ui/model/json/JSONModel"

], function(BaseController, MessageToast, JSONModel) {
	"use strict";
	var valueHelpDialog1;

	return BaseController.extend("com.assistente.controller.App", {

		onInit: function() {

			var oViewModel,
				fnSetAppNotBusy,
				oListSelector = this.getOwnerComponent().oListSelector,
				iOriginalBusyDelay = this.getView().getBusyIndicatorDelay();

			oViewModel = new JSONModel({
				busy: true,
				delay: 0
			});

			this.getView().setModel(oViewModel, "appView");

			fnSetAppNotBusy = function() {
				oViewModel.setProperty("/busy", false);
				oViewModel.setProperty("/delay", iOriginalBusyDelay);
			};

			this.getOwnerComponent().getModel().metadataLoaded().then(fnSetAppNotBusy);

			oListSelector.attachListSelectionChange(function() {
				this.byId("idAppControl").hideMaster();
			}, this);

			this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());


			//if (!valueHelpDialog1) {
				valueHelpDialog1 = sap.ui.xmlfragment(
					"com.assistente.view.Inicio",
					this
				);
				valueHelpDialog1.setEscapeHandler(this.onEscapePress);
				this.getView().addDependent(valueHelpDialog1);
			//}


		},

		onEscapePress: function() {

		},

		onClose: function(Evt) {

			if (sap.ui.getCore().byId("idComboLojaFragment").getSelectedKey() !== "") {

				valueHelpDialog1.close();

				var oData;
				oData = {
					"cod_dist": sap.ui.getCore().byId("idComboLojaFragment").getSelectedKey()
				}

				var thisView = this;
				this.CentroLoja = new sap.ui.model.json.JSONModel();

				var loja = [];
				loja.push({
					loja: sap.ui.getCore().byId("idComboLojaFragment").getSelectedKey()
				})
				this.CentroLoja.setData(loja);
				sap.ui.getCore().setModel(this.CentroLoja, "centroloja");

				//  let nomeLoja = sap.ui.getCore().byId("container-com.assistente---inicio--nomeLoja");

				//if (typeof nomeLoja != undefined) {
				//nomeLoja.setText(sap.ui.getCore().byId("idComboLojaFragment").getSelectedKey());
				//sap.ui.getCore().setModel(sap.ui.getCore().byId("idComboLojaFragment").getSelectedKey(), "nomeLoja");
				//}

				/* var oModel = this.getView().getModel();
		  oModel.read("/atualiza_lojaSet(cod_dist='" + sap.ui.getCore().byId("idComboLojaFragment").getSelectedKey() + "')", {
			success: function (success, response, odata) {
			  thisView.getView().setBusy(false);
			  MessageToast.show("Loja selecionada");
			  valueHelpDialog1.destroy();
			},
			error: function (oError, response) {
			  thisView.getView().setBusy(false);
			  MessageToast.show(hdrMessage);
			  valueHelpDialog1.destroy();
			}

		  })
		  */

			} else {
				MessageToast.show("Selecione uma loja");
			}
		},

		onSetLoja: function(Result) {

			valueHelpDialog1.close();

			var oData;
			oData = {
				"cod_dist": Result.cod_dist
			}

			this.getView().setBusy(true);

			var thisView = this;
			this.CentroLoja = new sap.ui.model.json.JSONModel();

			var loja = [];
			loja.push({
				loja: Result.cod_dist
			})

			this.CentroLoja.setData(loja);

			sap.ui.getCore().setModel(this.CentroLoja, "centroloja");
			sap.ui.getCore().setModel(Result.cod_dist, "desc_loja");
			//sap.ui.getCore().byId("__component0---inicio--nomeLoja").setText(Result.cod_dist);

			var oModel = this.getView().getModel();

			oModel.read("/atualiza_lojaSet(cod_dist='" + Result.cod_dist + "')", {
				success: function(success, response, odata) {
					thisView.getView().setBusy(false);
					MessageToast.show("Loja selecionada: " + Result.cod_dist);
					valueHelpDialog1.destroy();
				},
				error: function(oError, response) {
					thisView.getView().setBusy(false);
					MessageToast.show(hdrMessage);
					valueHelpDialog1.destroy();
				}
			})
		}
	});
})