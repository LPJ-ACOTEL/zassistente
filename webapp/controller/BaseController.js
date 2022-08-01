sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast",
	"sap/ui/model/json/JSONModel",
	"com/assistente/controller/Results",
	'sap/m/MessageItem',
	'sap/m/MessageView',
	"sap/m/MessageBox",
	'sap/m/Button',
	'sap/m/Dialog',
	'sap/m/Bar',
	'sap/m/Title'
], function (BaseController, MessageToast, JSONModel, Results, MessageItem, MessageView, MessageBox, Button, Dialog, Bar, Title) {
	"use strict";
	var valueHelpDialog1;

	return BaseController.extend("com.assistente.controller.App", {

		onInit: function () {

		},

		_showMessageError: function(oMsg){
			
			var oTableError = [],
			oModel = new JSONModel();
			
			oMsg.error.innererror.errordetails.map(function(resultItem) {
				if(resultItem.code == '')
					oTableError.push({	type: 'Error',
										title: resultItem.message,
										description: resultItem.message });
			});
		
			oModel.setData(oTableError);

			var oMessageTemplate = new MessageItem({
				type: '{type}',
				title: '{title}',
				description: '{description}'
			});

			this.oMessageView = new MessageView({
				showDetailsPageHeader: false,
				itemSelect: function () {
					oBackButton.setVisible(true);
				},
				items: {
					path: "/",
					template: oMessageTemplate
				}
			});

			var that = this;
			var oBackButton = new Button({
					icon: "sap-icon://nav-back",
					visible: false,
					press: function () {
						that.oMessageView.navigateBack();
						this.setVisible(false);
					}
				});



			this.oMessageView.setModel(oModel);

			this.oDialog = new Dialog({
				resizable: true,
				content: this.oMessageView,
				state: 'Error',
				beginButton: new Button({
					press: function () {
						this.getParent().close();
					},
					text: "Fechar"
				}),
				customHeader: new Bar({
					contentLeft: [oBackButton],
					contentMiddle: [
						new Title({text: "Error"})
					]
				}),
				contentHeight: "50%",
				contentWidth: "50%",
				verticalScrolling: false
			});			

			this.oMessageView.navigateBack();
			this.oDialog.open();

		},

		_showCondPagto: function(oData){
			var oModelPedido = new JSONModel();
				oModelPedido.setData(oData);
				this.getView().setModel(oModelPedido, "ModelPedido");

			var oModelEdit = new JSONModel();
				oModelEdit.setData({value: false});
				this.getView().setModel(oModelEdit, "modelEditPagto");

			if (! this._oDialogCondPagto) {
				var oView = this.getView();
				this._oDialogCondPagto = sap.ui.xmlfragment(oView.getId(),"com.assistente.view.fragments.DialogPagto", this);
		  	}

			this.getView().addDependent(this._oDialogCondPagto);
			
			// toggle compact style
			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialogCondPagto);
			this._oDialogCondPagto.open();

			//Adiciona Footer a Tabela (Valores Totais)
			var sFooter1 = new sap.m.Label({ text : "{i18n>labelCondPagto5}"});
			this.getView().byId("IdTableConditions").getColumns()[4].setFooter(sFooter1);

			var sFooter2 = new sap.m.ObjectNumber({ number: "{path: 'ModelPedido>/ValorTotal', type: 'sap.ui.model.type.Float', formatOptions: { groupingEnabled: true, groupingSeparator: '.', decimalSeparator : ',', minFractionDigits: 2 }}",
											 unit: "BRL"  });
			this.getView().byId("IdTableConditions").getColumns()[5].setFooter(sFooter2);
					
		},

		onHandleCancelarCondPagto: function(oEvent){

			MessageBox.confirm("Confirma o cancelamento? Os dados inseridos na tela serão perdidos.", {
                "title": "Confirmação",
				"actions": [MessageBox.Action.YES, MessageBox.Action.NO],
                "emphasizedAction": MessageBox.Action.NO,
                "onClose": this.onHandleCloseConfirmacao.bind(this)
            });
		},
		
		onHandleCloseConfirmacao: function (oEvent) {
			
			if (oEvent == MessageBox.Action.NO) {
				return;
			}
			
			this._oDialogCondPagto.destroy();
			this._oDialogCondPagto = null;

		},

		onHandleTablePagtoPress: function(oEvent){
			var oId = oEvent.getSource().getId(),
				oModel = this.getView().getModel("ModelPedido"),
				oDados = oModel.getProperty("/ItemsCondPagto");

			if(oId.indexOf("REMOVE") !== -1){
				var valoresSelecionados = this.byId("IdTableConditions").getSelectedContexts();
				if (valoresSelecionados.length === 0) {
					MessageBox.alert("Favor Selecionar a linha");
					return;
				}

				for ( var i = valoresSelecionados.length - 1; i >= 0; i--) {
					var path = valoresSelecionados[i].sPath;
					var idx = parseInt(path.substring(path.lastIndexOf('/') + 1));
					oDados.splice(idx, 1);
				}
				
				oModel.setProperty("/ItemsCondPagto", oDados);
				this.byId("IdTableConditions").removeSelections(true);

				return;		
			} 

			if(oId.indexOf("ADD") !== -1){
				if (! this._oDialogSelectCondPagto) {
					var oView = this.getView();
					this._oDialogSelectCondPagto = sap.ui.xmlfragment(oView.getId(),"com.assistente.view.fragments.AddCondPagto", this);
				  }
	
				this.getView().addDependent(this._oDialogSelectCondPagto);
				
				// toggle compact style
				jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialogSelectCondPagto);
				this._oDialogSelectCondPagto.open();
			}

			if(oId.indexOf("CALC") !== -1){
				var oDataModel = Object.assign({}, oModel.getData()),
				sPath = "/PagamentoSet";

				oDataModel.ItemsVenda = JSON.stringify(oDataModel.ItemsVenda);
				oDataModel.ItemsCondPagto = JSON.stringify(oDataModel.ItemsCondPagto);

				Results.recalculaPagamento(sPath, oDataModel).then(
					function(data) {
						console.log(data);
						oModel.setProperty("/ItemsCondPagto", data.ItemsCondPagto);
						oModel.setProperty("/ValorTotal", data.ValorTotal);
					}.bind(this),
					function(error) {
						var sMsg = JSON.parse(error.responseText);
						this._showMessageError(sMsg);
					}.bind(this)
				);
			}

		},

		onHandleCancelarSelectCondPagto: function(oEvent){
			this._oDialogSelectCondPagto.destroy();
			this._oDialogSelectCondPagto = null;
		},

		onHandleAcceptSelectCondPagto: function(oEvent){
			var oModel = this.getView().getModel("ModelPedido"),
				oDados = oModel.getProperty("/ItemsCondPagto"),
				oCombo = this.byId("ID_SELECT_COND_PAGTO");

				oDados.push({desconto: 0,
							 ndias: 0,
							 num_parc: 0,
							 taxa: 0,
							 valor: 0,
							 valor_total: 0,
							 vkorg: "",
							 vtext: oCombo._getSelectedItemText(),
							 vtweg: "",
							 zterm: oCombo.getSelectedKey()});

				oModel.setProperty("/ItemsCondPagto", oDados);
				this.onHandleCancelarSelectCondPagto();
		},

		onHandleAlterarCondPagto: function(oEvent){
			var oModel = this.getView().getModel("modelEditPagto");
			oModel.setProperty("/value", !oModel.getProperty("/value"));

			if(!oModel.getProperty("/value"))
				return;

		},

		onHandleEfetuarCondPagto: function(oEvent){

		}

	});
})