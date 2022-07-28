sap.ui.define(
	[
		"sap/ui/core/mvc/Controller",
		"sap/m/MessageToast",
		"sap/ui/model/json/JSONModel",
		"sap/ui/core/Fragment",
		"sap/m/Dialog",
		"sap/m/Button",
		"sap/m/library",
		"sap/m/List",
		"sap/m/StandardListItem",
		"sap/m/Text",
		"com/assistente/controller/Results",
		"com/assistente/model/formatter",
		"sap/m/MessageBox",
		"sap/ui/core/routing/History",
		"sap/ui/core/library",
	],
	function(
		BaseController,
		MessageToast,
		JSONModel,
		Fragment,
		Dialog,
		Button,
		mobileLibrary,
		List,
		StandardListItem,
		Text,
		Results,
		formatter,
		MessageBox,
		History,
		CoreLibrary
	) {
		"use strict";
	return BaseController.extend("com.assistente.controller.Produtos", {

		onInit: function() {

			this.getOwnerComponent().getRouter().getRoute("produtos").attachMatched(this._routeMatched, this);

		},

		_routeMatched: function(oEvent) {
			
			this.getView().byId("nomeLoja").setVisible(true);
			
			if (oEvent.getParameters().name === "produtos") {
				
				var sFlag = this.getModelIniti();
			    if (sFlag === "") {
				   this.limpaTela();
				}else{
					this.Load();
				}
				
				var nameUser = sap.ui.getCore().getModel("usuarionome_loja");
				var user = sap.ui.getCore().getModel("usuario_loja");
				this.byId("idUsuario").setText(user);
			    this.byId("nomeUsuario").setText(nameUser);
                var sLoja = sap.ui.getCore().getModel("nomeLoja");
				let nomeLoja = this.byId("nomeLoja");
				if (typeof sLoja != undefined) {
					nomeLoja.setText(sLoja);
				}
                this.byId("page").scrollTo(0);

				this.getMatchodes();
			}
		},

		Load: function(){
			var modelIniti = sap.ui.getCore().getModel("ModelIniti");
			this.getView().byId("idMaterial").setValue(modelIniti.getData()[0].Material);
		    this.getView().byId("idCentro").setValue(modelIniti.getData()[0].Centro);
			this.getView().byId("idCanal").setValue(modelIniti.getData()[0].Canal);
			this.getView().byId("idGrupo").setValue(modelIniti.getData()[0].Grupo);
			this.onFiltrar();
		},

		getMatchodes: function(){
			
			var this_ = this;

			Results.buscaCentro().then(
				function(data) {
					var oData = {};
					var oModelSearch = new JSONModel();
					oData.Itens = data;
					oModelSearch.setData(oData);
					this_.getView().setModel(oModelSearch, "idCentro");

					Results.buscaCanal().then(
						function(data) {
							var oData = {};
							var oModelSearch = new JSONModel();
							oData.Itens = data;
							oModelSearch.setData(oData);
							this_.getView().setModel(oModelSearch, "idCanal");

							var sFlag = this_.getModelIniti();
							if (sFlag === "") {
								this_.preenchimentoAutomatico(this_);
							}
							this_.setModelIniti("");
							
						},
						function(error) {
	
						}
					);
					
				},
				function(error) {
				}
			);
			
				Results.buscaGrupo().then(
					function(data) {
						var oData = {};
						var oModelSearch = new JSONModel();
						oData.Itens = data;
						oModelSearch.setData(oData);
						this_.getView().setModel(oModelSearch, "idGrupo");
					},
					function(error) {
					}
				);	
		},

		preenchimentoAutomatico: function(this_) {
			Results.preenchimentoAutomatico().then(
				function(data) {
					if (data.length > 0) {
						this_.getView().byId("idCentro").setValue(data[0].Centro);
						this_.buscaModel(this_.getView().byId("idCentro"), "idCentro");
						this_.getView().byId("idCanal").setValue(data[0].Canal);
						this_.buscaModel(this_.getView().byId("idCanal"), "idCanal");
					}
					this_.getView().setBusy(false);
				},
				function(error) {
					this_.getView().setBusy(false);
				}
			);
		},

		onFiltrar: function(){

			var __this = this;
            var idMaterial = this.retornaValor(
				this.getView().byId("idMaterial").getValue());
			var iGrupo = this.retornaValor(
			this.getView().byId("idGrupo").getValue());
			var iCanalDist = this.retornaValor(
			this.getView().byId("idCanal").getValue());
			var iCentro = this.retornaValor(this.getView().byId("idCentro").getValue());
			
			this.getView().setBusy(true);
			Results.ListaProdutos(idMaterial,iGrupo,iCanalDist,iCentro
			).then(
				function(dados) {

					var oModel1 = new JSONModel();
						oModel1.setSizeLimit(5000);
						var oData1 = {};
						oData1.Itens = dados;
						oModel1.setData(oData1);
						__this.getView().setModel(oModel1, "ModelItens");
						__this.getView().setBusy(false);

				},
				function(error) {							
					MessageBox.alert("Erro ao chamar o gateway");
				    __this.getView().setBusy(false); }
			);

		},

		onLinkEstoque: function(oEvent) {
			
			this.setModelIniti("X");
			var sPatch = oEvent.getSource().getBindingContext("ModelItens").getPath();
			var oSource = oEvent.getSource();
			var oModel = oSource.getModel("ModelItens");
			var oRow = oModel.getProperty(sPatch);

			var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");
			var hash = (oCrossAppNavigator && oCrossAppNavigator.hrefForExternal({
				target: {
					semanticObject: "Material",   // Semantic Object Name
					action: "displayStockMultipleMaterials"           // Action
				},
				params: {
					"Material": oRow.Material,
					"Plant":    oRow.Centro
				}
			})) || ""; // generate the Hash to display a Supplier
			oCrossAppNavigator.toExternal({
				target: {
					shellHash: hash
				}
			}); // navigate to Supplier application
			
		},

		onSelectDialogPress: function(oEvent) {
			var sInputValue, sSearchFiled;

			sInputValue = oEvent.getSource().getValue();

			if (this._oDialog) {
				this._oDialog.destroy();
			}

			this.inputId = oEvent.getSource().getId();
			this._oDialog = sap.ui.xmlfragment(
				"com.assistente.view.ValueHelpDialogBasic",
				this
			);

			var i18nModel = new sap.ui.model.resource.ResourceModel({
				bundleUrl: "i18n/i18n.properties",
			});
			this._oDialog.setModel(i18nModel, "i18n");

			this.setModelDialog("idCentro", this.inputId);
			this.setModelDialog("idGrupo", this.inputId);
			this.setModelDialog("idCanal", this.inputId);
			this.setModelDialog("idMaterial", this.inputId);
	
			// toggle compact style
			jQuery.sap.syncStyleClass(
				"sapUiSizeCompact",
				this.getView(),
				this._oDialog
			);

			this._oDialog.getBinding("items");
			this._oDialog.open(sInputValue);
		},

		handleSearchClientes: function(oEvent) {

			var filters = [];
			var query = oEvent.getParameter("value");
			var query2 = query;
			var this_ = this;
			var sCodigo = "";
			var sNome = "";
			var oData = {};
			var result = "";
			var oModelSearch = new JSONModel();

			if ($.isNumeric(query)) {
				sCodigo = query;
			} else {
				sNome = query;
			}

			result = this.inputId.includes("idMaterial", 0);
				if (result) {
					if (sCodigo !== "" || sNome !== "") {
						Results.buscaMaterial(sCodigo, sNome).then(
							function(data) {
								oData.Itens = data;
								oModelSearch.setData(oData);
								this_.getView().setModel(oModelSearch, "idMaterial");
								this_._oDialog.setModel(oModelSearch, "ModelSearch");
							},
							function(error) {}
						);
					}
					return false;
				}

		
			if (query && query.length > 0 && query.trim() !== "") {
				var filter;
				filter = new sap.ui.model.Filter(
					"cod",
					sap.ui.model.FilterOperator.Contains,
					query
				);
				filters.push(filter);
			}

			var binding = oEvent.getSource().getBinding("items");
			binding.filter(filters);
		},

		_handleValueHelpClose: function(evt) {
			//Atribui o valor do search help para o campo
			var oSelectedItem, fieldInput;
			oSelectedItem = evt.getParameter("selectedItem");

			if (oSelectedItem) {
				fieldInput = this.getView().byId(this.inputId);

				fieldInput.setValue(
					oSelectedItem.getTitle() + "-" + oSelectedItem.getDescription()
				);
			}
		},

		buscaModel: function(sField, model) {
			
			var this_ = this;
			let result = sField.getId().includes(model, 0);
			var value = sField.getValue().toUpperCase();

				if (this.getView().getModel(model) !== undefined) {
					var Itens = this.getView().getModel(model).getData().Itens;
					var this_ = this;
					if (result) {
						Itens.forEach(function(data) {
							if (value === data.cod) {
								this_
									.getView()
									.byId(model)
									.setValue(data.cod + "-" + data.desc);
							}
						});
					}
				}
		},

		setModelDialog: function(sValue, input) {

			var sCodigo = "";
			var sNome = "";
			var value = "";
			var array = "";
			var result = "";

			array = this.getView().byId(input).getValue().split("-");
			value = array[0];

			if ($.isNumeric(value)) {
				sCodigo = value;
			} else {
				sNome = value;
			}

			var oData1 = {};
			var oModelSearch1 = new JSONModel();
			var data1 = [];
			var this_ = this;

			result = input.includes(sValue, 0);
				if (result) {
					if (sValue === "idMaterial" && (sCodigo !== "" || sNome !== "")) {
						Results.buscaMaterial(sCodigo, sNome).then(
							function(data) {
								var oData = {};
								var oModelSearch = new JSONModel();
								oData.Itens = data;
								oModelSearch.setData(oData);
								this_.getView().setModel(oModelSearch, "idMaterial");
								this_._oDialog.setModel(oModelSearch, "ModelSearch");
							},
							function(error) {}
						);
					} else {
						oData1.Itens = data1;
						oModelSearch1.setData(oData1);
						this_._oDialog.setModel(oModelSearch1, "ModelSearch");
					}
				}

			result = input.includes(sValue, 0);
			if (result) {
				this._oDialog.setModel(this.getView().getModel(sValue),"ModelSearch");
			}

		},

		retornaValor: function(value) {
			var value1 = value.split("-");
			return value1[0];
		},

		handleChangeAll: function(oEvent) {
			// Metodo responsavel por atribuir a descrição no campo caso o usuario opite por digitar na mão
			var sField = oEvent.getSource();
			this.buscaModel(sField, "idCentro");
			this.buscaModel(sField, "idCanal");
			this.buscaModel(sField, "idGrupo");
		},

		limpaTela: function() {

			this.getView().byId("idMaterial").setValue("");
			this.getView().byId("idCentro").setValue("");
			this.getView().byId("idCanal").setValue("");
			this.getView().byId("idGrupo").setValue("");

			//Iniciar a model
			var oData = {};
			var oModel = new JSONModel(oData);
			this.getView().setModel(oModel, "ModelItens");

		},

		setModelIniti: function(sValue) {

			var oModel = new JSONModel();
			var dataArray = {};

			if (sValue ==="X"){
			   dataArray = {
					Material: this.getView().byId("idMaterial").getValue(),
					Centro: this.getView().byId("idCentro").getValue(),
					Canal: this.getView().byId("idCanal").getValue(),
					Grupo: this.getView().byId("idGrupo").getValue(),
			   };
		    }

			var dados = [];
			dados.push(dataArray);

			var oData = {};
			oData = dados;
			oModel.setData(oData);

			sap.ui.getCore().setModel(oModel, "ModelIniti");
		},

		getModelIniti: function() {
			var modelIniti = sap.ui.getCore().getModel("ModelIniti");
			var valorRetorno = "";
			if (modelIniti === undefined) {
				valorRetorno = "";
				return valorRetorno;
			}

			if (modelIniti.getData()[0].Centro !== "" && modelIniti.getData()[0].Material !== undefined)  {
				valorRetorno = "X";
				return valorRetorno;
			}else{
				valorRetorno = "";
				return valorRetorno;
			}
		},

		onExit: function(){
			
		},

		onBack: function(oEvent) {
			
			this.setModelIniti("");
			var oHistory, sPreviousHash;
			oHistory = History.getInstance();
			sPreviousHash = oHistory.getPreviousHash();

			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				this.getOwnerComponent().getRouter().navTo("master");
			}
		},

	});
})