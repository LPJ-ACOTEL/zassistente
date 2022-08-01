sap.ui.define(
	[
		"com/assistente/controller/BaseController",//"sap/ui/core/mvc/Controller",
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
		"sap/ui/core/library"
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

		var ValueState = CoreLibrary.ValueState;

		return BaseController.extend(
			"com.assistente.controller.AdministraCotacao", {
				formatter: formatter,

				onInit: function() {
					//this.getOwnerComponent().getRouter().getRoute("administracotacao").attachMatched(this._routeMatched, this);
					this.getOwnerComponent()
						.getRouter()
						.getRoute("administracotacao")
						.attachPatternMatched(this._routeMatched, this);
				},

				_routeMatched: function(oEvent) {
					this.getView().byId("nomeLoja").setVisible(true);
					if (oEvent.getParameters().name === "administracotacao") {
						var nameUser = sap.ui.getCore().getModel("usuarionome_loja");
						var user = sap.ui.getCore().getModel("usuario_loja");
						this.byId("idUsuario").setText(user);
						this.byId("nomeUsuario").setText(nameUser);

						var sLoja = sap.ui.getCore().getModel("nomeLoja");
						let nomeLoja = this.byId("nomeLoja");
						if (typeof sLoja != undefined) {
							nomeLoja.setText(sLoja);
						}

						this.getView().setBusy(true);
						this.byId("page").scrollTo(0);

						var sFlag = this.getModelIniti();
						if (sFlag === "X") {
							this.limpaTela();
						}

						//Filtra novamente caso passe por cotação ou ordem
						if ( this.getHistorico() ){
							this.onFiltrar();
						}
						
						this.getMathcode();
					}
				},

				getHistorico: function(){
					var vLength = History.getInstance().aHistory.length - 1;
					if ( History.getInstance().aHistory[vLength].substr(0,8) === "cotacao/" || 
						 History.getInstance().aHistory[vLength].substr(0,6) === "ordem/" ){
						return true;
					}else{
						return false;
					}
				},

				getMathcode: function() {
					var count = 0;
					var this_ = this;

					var oDataCombo = {};
					var combo = [];
					var estruturaCombo = {
						name: "Cotação",
						key: "Cotacao",
					};
					combo.push(estruturaCombo);
					estruturaCombo = {
						name: "Validade",
						key: "DataValidade",
					};
					combo.push(estruturaCombo);
					estruturaCombo = {
						name: "Status Cotação",
						key: "StatusCotacao",
					};
					combo.push(estruturaCombo);
					estruturaCombo = {
						name: "Cliente",
						key: "Cliente",
					};
					combo.push(estruturaCombo);
					estruturaCombo = {
						name: "Vendedor",
						key: "Vendedor",
					};
					combo.push(estruturaCombo);
					estruturaCombo = {
						name: "Qtd",
						key: "Qtd",
					};
					combo.push(estruturaCombo);
					estruturaCombo = {
						name: "Valor",
						key: "Valor",
					};
					combo.push(estruturaCombo);
					estruturaCombo = {
						name: "OV",
						key: "Ordem",
					};
					combo.push(estruturaCombo);
					estruturaCombo = {
						name: "Status OV",
						key: "StatusOrdem",
					};

					combo.push(estruturaCombo);
					var oModelSearchCombo = new JSONModel();
					oDataCombo.Itens = combo;
					oModelSearchCombo.setData(oDataCombo);
					this.getView().setModel(oModelSearchCombo, "ModelFilter");


					Results.buscaCanal().then(
						function(data) {
							var oData = {};
							var oModelSearch = new JSONModel();
							oData.Itens = data;
							oModelSearch.setData(oData);
							this_.getView().setModel(oModelSearch, "idCanal");
							count = count + 1;
						},
						function(error) {
							count = count + 1;
						}
					);

					Results.buscaMotivoRecusa().then(
						function(data) {
							var oData = {};
							var oModelSearch = new JSONModel();
							oData.Itens = data;
							oModelSearch.setData(oData);
							this_.getView().setModel(oModelSearch, "idMotivo");
							count = count + 1;
						},
						function(error) {
							count = count + 1;
						}
					);

					Results.buscaCentro().then(
						function(data) {
							var oData = {};
							var oModelSearch = new JSONModel();
							oData.Itens = data;
							oModelSearch.setData(oData);
							this_.getView().setModel(oModelSearch, "idCentro");
							count = count + 1;
							
							if ( !this_.getHistorico()){
								this_.preenchimentoAutomatico(this_);
							}
							
						},
						function(error) {
							count = count + 1;
						}
					);

					Results.buscaCondPag().then(
						function(data) {
							var oData = {};
							var oModelSearch = new JSONModel();
							oData.Itens = data;
							oModelSearch.setData(oData);
							this_.getView().setModel(oModelSearch, "idCondPagto");
							count = count + 1;
						},
						function(error) {
							count = count + 1;
						}
					);					

				},

				preenchimentoAutomatico: function(this_) {
					Results.preenchimentoAutomatico().then(
						function(data) {
							if (data.length > 0) {
								this_.getView().byId("idCentro").setValue(data[0].Centro);
								this_.buscaModel(this_.getView().byId("idCentro"), "idCentro");
							}

							Results.verificaVendedor().then(
								function(data) {
									if (data.length >=1){
									 if (data[0].Vendedor !==""){
										this_.getView().byId("idVendedor").setValue(data[0].Vendedor);
										this_.getView().byId("idVendedor").setEditable(false);
									 }
									}
								    this_.getView().setBusy(false);
								},
								function(error) {
									this_.getView().setBusy(false);
								}
							);

						},
						function(error) {
							this_.getView().setBusy(false);
						}
					);
				},

				leftPad: function(value, totalWidth, paddingChar) {
					var length = totalWidth - value.toString().length + 1;
					return Array(length).join(paddingChar || '0') + value;
				},

				onFiltrar: function() {
					this.getView().setBusy(true);
					var __this = this;

					var idCotacao = this.getView().byId("idCotacao").getValue();
					var idOv = this.getView().byId("idOrdem").getValue();
					var idDataDe = this.getView().byId("idDataDe").getValue();
					var idDataAte = this.getView().byId("idDataAte").getValue();
					var idCanal = this.buscaCodigo(
						this.getView().byId("idCanal").getValue()
					);
					var idCriado = this.getView().byId("idCriado").getValue();
					var idCriadoDe = this.getView().byId("idCriadoDe").getValue();
					var idCriadoAte = this.getView().byId("idCriadoAte").getValue();
					var idCliente = this.buscaCodigo(
						this.getView().byId("idCliente").getValue()
					);
					var idPedido = this.getView().byId("idPedido").getValue();
					var idCentro = this.buscaCodigo(
						this.getView().byId("idCentro").getValue()
					);
					var idMotivo = this.buscaCodigo(
						this.getView().byId("idMotivo").getValue()
					);
					var idVendedor = this.buscaCodigo(
						this.getView().byId("idVendedor").getValue()
					);
					this.getView().byId("idCriadoDe").setValueState("None");
					this.getView().byId("idCriadoDe").setValueState("None");

					if (idDataDe === "" && idCriadoDe === "") {
						MessageBox.alert("Favor preencher data de criação ou validade");
						if (idDataDe === "") {
							this.getView().byId("idDataDe").setValueState("Error");
						}
						if (idCriadoDe === "") {
							this.getView().byId("idCriadoDe").setValueState("Error");
						}
						this.getView().setBusy(false);
						return;
					}

					if (idPedido !== "") {
						//   idPedido = this.leftPad(idPedido,10);
					}

					if (idVendedor !== "") {
						idVendedor = this.leftPad(idVendedor, 10);
					}

					if (idOv !== "") {
						idOv = this.leftPad(idOv, 10);
					}

					Results.buscaDadosAdmCotacao(
						idCotacao,
						idOv,
						idDataDe,
						idDataAte,
						idCanal,
						idCriado,
						idCriadoDe,
						idCriadoAte,
						idCliente,
						idPedido,
						idCentro,
						idMotivo,
						idVendedor
					).then(
						function(data) {
							var statusOV = "";
							var statusCotacao = "";
							var array = {};
							var dados = [];
							var dataAtual = new Date();
							var OrdemRef = "";
							var CotacaoRef = "";
							var sValidade = "";
							var valor = "";
							var qtd = "";

							for (var i = 0; i < data.length; i++) {

								statusOV = "";
								statusCotacao = "";

								if (idCotacao !== "" || (idCotacao === "" && idOv === "")) {

									sValidade = __this.converteData(data[i].DataValidade);
									data[i].DataValidade = __this.converteData2(data[i].DataValidade);

									if (data[i].Bloqueio === "Z2") {
										statusCotacao = "WF PcP Slitter";
									} else {
										if (
											data[i].DataValidade >= dataAtual &&
											data[i].StatusGlobal === "A"
										) {
											statusCotacao = "Criada";
										} else {
											if (
												data[i].DataValidade < dataAtual &&
												data[i].StatusGlobal === "A"
											) {
												statusCotacao = "Vencida";
											}
										}
									}

									if (data[i].StatusGlobal === "B") {		
										statusCotacao = "Parcialmente atendida";
									} else {
										if (data[i].StatusGlobal === "C") {
											statusCotacao = "Atendida";
										}
									}

									if (data[i].StatusRecusa === "C") {
										statusCotacao = "Recusada";
									}

									if(data[i].Bloqueio !== ""){
										statusCotacao = data[i].Bloqueio;
									}

									if (data[i].StatusAprovacao === "A" || data[i].StatusAprovacao === "D") {
										statusOV = "Em aprovação";
									}

									//Status OV

									if (data[i].StatusVerificacao2 === "B") {
										statusOV = "Financeiro";
									}

									if (data[i].StatusAprovacao2 === "A") {
										statusOV = "WF Desconto";
									}
									if (data[i].StatusRecusa2 === "C") {
										statusOV = "Recusada";
									}

									if (data[i].StatusGlobal2 === "B") {
										statusOV = "Processamento";
									}

									if (data[i].Bloqueio2 === "Z2") {
										statusOV = "WF PCP";
									} else {
										if (data[i].StatusGlobal2 === "C") {

											if (data[i].ValorRef >= 1) {
												statusOV = "Faturada";
											} else if (data[i].QtdOrdem === data[i].QtdFaturada) {
												statusOV = "Faturada";
											} else {
												statusOV = "Processamento";
											}

										} else {
											if (
												data[i].Bloqueio2 === "" &&
												(data[i].StatusAprovacao2 === "" ||
													data[i].StatusAprovacao2 === "B") &&
												data[i].StatusGlobal2 === "A" &&
												(data[i].StatusRecusa2 === "" ||
													data[i].StatusRecusa2 === "A")
											) {
												statusOV = "Criada";
											}
										}
									}

									if(data[i].Bloqueio2 !== ""){
										statusOV = data[i].Bloqueio2;
									}

									//Status OV
									if (data[i].TipoDoc == "C") {

										if (data[i].StatusVerificacao === "B") {
											statusOV = "Financeiro";
										}

										if (data[i].StatusAprovacao === "A") {
											statusOV = "WF Desconto";
										}
										if (data[i].StatusRecusa === "C") {
											statusOV = "Recusada";
										}

										if (data[i].StatusGlobal === "B") {
											statusOV = "Processamento";
										}

										if (data[i].Bloqueio === "Z") {
											statusOV = "WF PCP";
										} else {
											if (data[i].StatusGlobal === "C") {

												if (data[i].ValorRef >= 1) {
													statusOV = "Faturada";
												} else if (data[i].QtdOrdem === data[i].QtdFaturada) {
													statusOV = "Faturada";
												} else {
													statusOV = "Processamento";
												}

											} else {
												if (
													data[i].Bloqueio === "" &&
													(data[i].StatusAprovacao === "" ||
														data[i].StatusAprovacao === "B") &&
													data[i].StatusGlobal === "A" &&
													(data[i].StatusRecusa === "" ||
														data[i].StatusRecusa === "A")
												) {
													statusOV = "Criada";
												}
											}
										}
										if(data[i].Bloqueio !== ""){
											statusOV = data[i].Bloqueio;
										}
									}

								} else {
									// Status OV
									sValidade = __this.converteData(data[i].DataValidade2);
									if (data[i].StatusVerificacao === "B") {
										statusOV = "Financeiro";
									}

									if (data[i].StatusAprovacao === "A") {
										statusOV = "WF Desconto";
									}
									if (data[i].StatusRecusa === "C") {
										statusOV = "Recusada";
									}

									if (data[i].StatusGlobal === "B") {
										statusOV = "Processamento";
									}

									if (data[i].Bloqueio === "Z2") {
										statusOV = "WF PCP";
									} else {
										if (data[i].StatusGlobal === "C") {

											if (data[i].ValorRef >= 1) {
												statusOV = "Faturada";
											} else if (data[i].QtdOrdem === data[i].QtdFaturada) {
												statusOV = "Faturada";
											} else {
												statusOV = "Processamento";
											}

										} else {
											if (
												data[i].Bloqueio === "" &&
												(data[i].StatusAprovacao === "" ||
													data[i].StatusAprovacao === "B") &&
												data[i].StatusGlobal === "A" &&
												(data[i].StatusRecusa === "" ||
													data[i].StatusRecusa === "A")
											) {
												statusOV = "Criada";
											}
										}
									}

									if(data[i].Bloqueio !== ""){
										statusOV = data[i].Bloqueio;
									}

									//Status Cotacao
									if (data[i].Bloqueio2 === "Z2") {
										statusCotacao = "WF PcP Slitter";
									} else {
										if (
											data[i].DataValidade >= dataAtual &&
											data[i].StatusGlobal2 === "A"
										) {
											statusCotacao = "Criada";
										} else {
											if (
												data[i].DataValidade < dataAtual &&
												data[i].StatusGlobal2 === "A"
											) {
												statusCotacao = "Vencida";
											}
										}
									}

									if (data[i].StatusGlobal2 === "B") {
										statusCotacao = "Parcialmente atendida";
									} else {
										if (data[i].StatusGlobal2 === "C") {
											statusCotacao = "Atendida";
										}
									}

									if (data[i].StatusRecusa2 === "C") {
										statusCotacao = "Recusada";
									}

									if(data[i].Bloqueio2 !== ""){
										statusCotacao = data[i].Bloqueio2;
									}
								}

								if (data[i].Cotacao !== "") {
									CotacaoRef = data[i].Cotacao;
									OrdemRef = data[i].OrdemRef;
								} else {
									CotacaoRef = data[i].CotacaoRef;
									OrdemRef = data[i].Ordem;
								}

								if (CotacaoRef === "") {
									statusCotacao = "";
									sValidade = "";
									qtd = __this.formatter.price3(data[i].Qtd2);
									valor = __this.formatter.price(Number(data[i].Valor2) + Number(data[i].Impostos2));
								}else{
									qtd = __this.formatter.price3(data[i].Qtd);
									valor = __this.formatter.price(Number(data[i].Valor) + Number(data[i].Impostos));
								}

								if (OrdemRef === "") {
									statusOV = "";
								}

								array = {
									Cotacao: CotacaoRef,
									DataValidade: sValidade,
									StatusCotacao: statusCotacao,
									Cliente: data[i].ClienteNome,
									Vendedor: data[i].VendedorNome,
									Qtd: qtd,
									Valor: valor,
									Ordem: OrdemRef,
									StatusOrdem: statusOV,
								};

								dados.push(array);
							}

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
							__this.getView().setBusy(false);
						}
					);
				},

				converteData: function(sData) {
					var value = "";
					if (sData !== null) {
						let dateI = new Date(sData);
						dateI.setDate(dateI.getDate() + 1);
						value = dateI.toLocaleDateString();
					} else {
						value = "";
					}
					return value;
				},

				converteData2: function(sData) {
					var value = "";
					if (sData !== null) {
						let dateI = new Date(sData);
						dateI.setDate(dateI.getDate() + 1);
						value = dateI;
					} else {
						value = "";
					}
					return value;
				},

				onLinkCotacao: function(oEvent) {
					var sPatch = oEvent
						.getSource()
						.getBindingContext("ModelItens")
						.getPath();
					var index = sPatch.substring(sPatch.length - 1);
					var oSource = oEvent.getSource();
					var oModel = oSource.getModel("ModelItens");
					var oRow = oModel.getProperty(sPatch);
					this.setModelIniti("");
					this.getOwnerComponent()
						.getRouter()
						.navTo("cotacao", {
							Id: oRow.Cotacao
						});
				},

				onLinkOrdem: function(oEvent) {
					var sPatch = oEvent
						.getSource()
						.getBindingContext("ModelItens")
						.getPath();
					var index = sPatch.substring(sPatch.length - 1);
					var oSource = oEvent.getSource();
					var oModel = oSource.getModel("ModelItens");
					var oRow = oModel.getProperty(sPatch);
					this.setModelIniti("");
					this.getOwnerComponent()
						.getRouter()
						.navTo("ordem", {
							Id: oRow.Ordem
						});
				},

				onCriarCotacao: function(oEvent) {
					this.setModelIniti("");
					this.getOwnerComponent().getRouter().navTo("cotacao", {
						Id: "0"
					});
				},
				onCriarOV: function(oEvent) {
					this.setModelIniti("");
					this.getOwnerComponent().getRouter().navTo("ordem", {
						Id: "0"
					});
				},
				onProrrogar: function(oEvent) {},
				onConverter: function(oEvent) {
					var valoresSelecionados = this.byId("idLista").getSelectedContexts();
					if (valoresSelecionados.length === 0) {
						MessageBox.alert("Favor Selecionar a linha");
						return;
					}
					var sPatch = valoresSelecionados[0].sPath;
					var oSource = oEvent.getSource();
					var oModelOrig = oSource.getModel("ModelItens");
					var oRow = oModelOrig.getProperty(sPatch);
					var idCotacao = oRow.Cotacao + ";1";

					if (oRow.Cotacao === "") {
						MessageBox.alert("Selecionar uma cotação valida");
						return;
					}

					this.setModelIniti("");
					this.getOwnerComponent()
						.getRouter()
						.navTo("ordem", {
							Id: idCotacao
						});
				},

				limpaTela: function() {
					var idCotacao = this.getView().byId("idCotacao").setValue("");
					var idOv = this.getView().byId("idOrdem").setValue("");
					var idDataDe = this.getView().byId("idDataDe").setValue("");
					var idDataAte = this.getView().byId("idDataAte").setValue("");
					var idCanal = this.getView().byId("idCanal").setValue("");
					var idCriado = this.getView().byId("idCriado").setValue("");
					var idCriadoDe = this.getView().byId("idCriadoDe").setValue("");
					var idCriadoAte = this.getView().byId("idCriadoAte").setValue("");
					var idCliente = this.getView().byId("idCliente").setValue("");
					var idPedido = this.getView().byId("idPedido").setValue("");
					var idCentro = this.getView().byId("idCentro").setValue("");
					var idMotivo = this.getView().byId("idMotivo").setValue("");
					var idVendedor = this.getView().byId("idVendedor").setValue("");

					var oModel1 = new JSONModel();
					var oData1 = {};
					var dados = [];
					oData1.Itens = dados;
					oModel1.setData(oData1);
					this.getView().setModel(oModel1, "ModelItens");
					this.getView().setBusy(false);
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
					this.setModelDialog("idCliente", this.inputId);
					this.setModelDialog("idCanal", this.inputId);
					this.setModelDialog("idVendedor", this.inputId);
					this.setModelDialog("idCotacao", this.inputId);
					this.setModelDialog("idMotivo", this.inputId);
					this.setModelDialog("idOrdem", this.inputId);

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

					result = this.inputId.includes("idCliente", 0);
					if (result) {
						if (sCodigo !== "" || sNome !== "") {
							Results.buscaEmissor(sCodigo, sNome).then(
								function(data) {
									oData.Itens = data;
									oModelSearch.setData(oData);
									this_.getView().setModel(oModelSearch, "idCliente");
									this_._oDialog.setModel(oModelSearch, "ModelSearch");
								},
								function(error) {}
							);
						}
						return false;
					}

					result = this.inputId.includes("idVendedor", 0);
					if (result) {
						if (sCodigo !== "" || sNome !== "") {
							Results.buscaVendedor(sCodigo, sNome).then(
								function(data) {
									oData.Itens = data;
									oModelSearch.setData(oData);
									this_.getView().setModel(oModelSearch, "idVendedor");
									this_._oDialog.setModel(oModelSearch, "ModelSearch");
								},
								function(error) {}
							);
						}
						return false;
					}

					result = this.inputId.includes("idOrdem", 0);
					if (result) {
						if (sCodigo !== "" || sNome !== "") {
							Results.buscaOv(sCodigo, sNome).then(
								function(data) {
									oData.Itens = data;
									oModelSearch.setData(oData);
									this_.getView().setModel(oModelSearch, "idOrdem");
									this_._oDialog.setModel(oModelSearch, "ModelSearch");
								},
								function(error) {}
							);
						}
						return false;
					}

					result = this.inputId.includes("idCotacao", 0);
					if (result) {
						if (sCodigo !== "" || sNome !== "") {
							Results.buscaCotacao(sCodigo, sNome).then(
								function(data) {
									oData.Itens = data;
									oModelSearch.setData(oData);
									this_.getView().setModel(oModelSearch, "idCotacao");
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

						var result = fieldInput.getId().includes("idOrdem", 0);
						if (result) {
							fieldInput.setValue(oSelectedItem.getTitle());
							return;
						}

						var result = fieldInput.getId().includes("idCotacao", 0);
						if (result) {
							fieldInput.setValue(oSelectedItem.getTitle());
							return;
						}

						fieldInput.setValue(
							oSelectedItem.getTitle() + "-" + oSelectedItem.getDescription()
						);
					}
				},

				buscaModel: function(sField, model) {
					var this_ = this;
					let result = sField.getId().includes(model, 0);
					var value = sField.getValue().toUpperCase();
					var sCodigo = sField.getValue().toUpperCase();

					if (value !== "") {
						if (model === "idVendedor") {
							Results.buscaVendedor(sCodigo, "").then(
								function(data) {
									if (data.length === 1) {
										this_
											.getView()
											.byId(model)
											.setValue(data[0].cod + "-" + data[0].desc);
									}
								},
								function(error) {}
							);
							return false;
						}

						if (model === "idOrdem") {
							Results.buscaOv(sCodigo, "").then(
								function(data) {
									if (data.length === 1) {
										this_
											.getView()
											.byId(model)
											.setValue(data[0].cod + "-" + data[0].desc);
									}
								},
								function(error) {}
							);
							return false;
						}

						if (model === "idCotacao") {
							Results.buscaCotacao(sCodigo, "").then(
								function(data) {
									if (data.length === 1) {
										this_
											.getView()
											.byId(model)
											.setValue(data[0].cod + "-" + data[0].desc);
									}
								},
								function(error) {}
							);
							return false;
						}

						if (model === "idCliente") {
							Results.buscaEmissor(sCodigo, "").then(
								function(data) {
									if (data.length === 1) {
										this_
											.getView()
											.byId(model)
											.setValue(data[0].cod + "-" + data[0].desc);
									}
								},
								function(error) {}
							);
							return false;
						}

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
						if (sValue === "idCliente" && (sCodigo !== "" || sNome !== "")) {
							Results.buscaEmissor(sCodigo, sNome).then(
								function(data) {
									var oData = {};
									var oModelSearch = new JSONModel();
									oData.Itens = data;
									oModelSearch.setData(oData);
									this_.getView().setModel(oModelSearch, "idCliente");
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
						if (sValue === "idVendedor" && (sCodigo !== "" || sNome !== "")) {
							Results.buscaVendedor(sCodigo, sNome).then(
								function(data) {
									var oData = {};
									var oModelSearch = new JSONModel();
									oData.Itens = data;
									oModelSearch.setData(oData);
									this_.getView().setModel(oModelSearch, "idVendedor");
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
						if (sValue === "idOrdem" && (sCodigo !== "" || sNome !== "")) {
							Results.buscaOv(sCodigo, sNome).then(
								function(data) {
									var oData = {};
									var oModelSearch = new JSONModel();
									oData.Itens = data;
									oModelSearch.setData(oData);
									this_.getView().setModel(oModelSearch, "idOrdem");
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
						if (sValue === "idCotacao" && (sCodigo !== "" || sNome !== "")) {
							Results.buscaCotacao(sCodigo, sNome).then(
								function(data) {
									var oData = {};
									var oModelSearch = new JSONModel();
									oData.Itens = data;
									oModelSearch.setData(oData);
									this_.getView().setModel(oModelSearch, "idCotacao");
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
						this._oDialog.setModel(
							this.getView().getModel(sValue),
							"ModelSearch"
						);
					}
				},

				handleChangeAll: function(oEvent) {
					// Metodo responsavel por atribuir a descrição no campo caso o usuario opite por digitar na mão
					var sField = oEvent.getSource();
					this.buscaModel(sField, "idCentro");
					this.buscaModel(sField, "idCliente");
					this.buscaModel(sField, "idCanal");
					this.buscaModel(sField, "idVendedor");
					this.buscaModel(sField, "idMotivo");
				},

				handleChange: function(oEvent) {
					var oDP = oEvent.getSource(),
						sValue = oEvent.getParameter("value"),
						bValid = oEvent.getParameter("valid");

					if (bValid) {
						oDP.setValueState(ValueState.None);
					} else {
						oDP.setValueState(ValueState.Error);
					}
				},

				onBack: function(oEvent) {
					var oHistory, sPreviousHash;
					this.setModelIniti("X");
					oHistory = History.getInstance();
					sPreviousHash = oHistory.getPreviousHash();

					if (sPreviousHash !== undefined) {
						window.history.go(-1);
					} else {
						this.getOwnerComponent().getRouter().navTo("master");
					}
				},

				onPressMenuButton: function() {
					sap.ui
						.controller("com.assistente.controller.Inicio")
						.onPressMenuButton();
				},

				buscaCodigo: function(field) {
					var value = [];
					if (field !== undefined && field !== "") {
						value = field.split("-");
						field = value[0];
					}
					return field;
				},

				onProrrogaValidade: function(oEvent) {
					var valoresSelecionados = this.byId("idLista").getSelectedContexts();
					if (valoresSelecionados.length === 0) {
						MessageBox.alert("Favor Selecionar a linha");
						return;
					}

					var sPatch = valoresSelecionados[0].sPath;
					var oSource = oEvent.getSource();
					var oModelOrig = oSource.getModel("ModelItens");
					var oRow = oModelOrig.getProperty(sPatch);

					if (oRow.Cotacao === "") {
						MessageBox.alert("Selecionar uma cotação valida");
						return;
					}

					if (this._oDialog3) {
						this._oDialog3.destroy();
					}

					this._oDialog3 = sap.ui.xmlfragment(
						"com.assistente.view.ProrrogaValidade",
						this
					);
					this.getView().addDependent(this._oDialog3);

					// toggle compact style
					jQuery.sap.syncStyleClass(
						"sapUiSizeCompact",
						this.getView(),
						this._oDialog3
					);

					this._oDialog3.setTitle("Prorroga Validade:");

					var __this = this;

					sap.ui.getCore().byId("idCotacao").setValue(oRow.Cotacao);

					__this._oDialog3.open();
				},

				onSaveProrroga: function(oEvent) {
					var idDate = sap.ui.getCore().byId("idDate").getValue();
					var idCotacao = sap.ui.getCore().byId("idCotacao").getValue();

					if (
						sap.ui.getCore().byId("idDate").getValueState() === ValueState.Error
					) {
						return;
					}

					if (idDate === "") {
						MessageBox.alert("Entrar com a data");
						return;
					}

					var this__ = this;
					this__.getView().setBusy(true);
					Results.prorrogaValidade(idCotacao, idDate).then(
						function(data) {
							if (data.length === 1) {
								this__.getView().setBusy(false);
								MessageBox.alert(data[0].Mensagem);
							}

							this__.onFiltrar();
						},
						function(error) {
							this__.getView().setBusy(false);
						}
					);

					this._oDialog3.close();
				},

				dialogProrrogaAfterClose: function(oEvent) {
					this._oDialog3.destroy();
				},

				onCancelar: function(oEvent) {
					this._oDialog3.close();
					this._oDialog3.destroy();
				},

				setModelIniti: function(sValue) {
					var oModel = new JSONModel();
					var oData = {};
					oData = sValue;
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

					if (modelIniti.getData() === "X") {
						valorRetorno = "X";
						return valorRetorno;
					}

					if (modelIniti.getData() === "") {
						valorRetorno = "";
						return valorRetorno;
					}
				},

				onFatura: function(oEvent) {
					var this_ = this;
					MessageBox.confirm("Confirma o faturamento ?", {
						title: "Informação",
						initialFocus: sap.m.MessageBox.Action.CANCEL,
						onClose: function (sButton) {
						if (sButton === MessageBox.Action.OK) {
							this_.fatura(oEvent);
						} else {
						}
						},
					});
				},

				fatura: function(oEvent) {

					var valoresSelecionados = this.byId("idLista").getSelectedContexts();
					if (valoresSelecionados.length === 0) {
						MessageBox.alert("Favor Selecionar a linha");
						return;
					}

					var sPatch = valoresSelecionados[0].sPath;
					var oSource = oEvent.getSource();
					var oModelOrig = this.getView().getModel("ModelItens");
					var oRow = oModelOrig.getProperty(sPatch);

					if (oRow.Ordem === "") {
						MessageBox.alert("Ordem de venda não criada na linha selecionada.");
						return;
					}

					if (oRow.StatusOrdem === "Faturada") {
						MessageBox.alert("Ordem de venda já faturada.");
						return;
					}

					this.getView().setBusy(true);
					var this__ = this;
					Results.faturar(oRow.Ordem).then(
						function(data) {
							MessageBox.alert(data.Mensagem);
							this__.getView().setBusy(false);
							this__.onFiltrar();
						},
						function(error) {
							this__.getView().setBusy(false);
						}
					);
				},

				onFluxo: function(oEvent) {

					var sDocumento = "";
					var valoresSelecionados = this.byId("idLista").getSelectedContexts();
					if (valoresSelecionados.length === 0) {
						MessageBox.alert("Favor Selecionar a linha");
						return;
					}

					var sPatch = valoresSelecionados[0].sPath;
					var oSource = oEvent.getSource();
					var oModelOrig = oSource.getModel("ModelItens");
					var oRow = oModelOrig.getProperty(sPatch);

					if (oRow.Cotacao === "") {
						sDocumento = oRow.Ordem;
					}else{
						sDocumento = oRow.Cotacao;
					}
	
					if (this._oDialog4) {
						this._oDialog4.destroy();
					}
	
					this._oDialog4 = sap.ui.xmlfragment(
						"com.assistente.view.Fluxo",
						this
					);
					this.getView().addDependent(this._oDialog4);
	
					// toggle compact style
					jQuery.sap.syncStyleClass(
						"sapUiSizeCompact",
						this.getView(),
						this._oDialog4
					);
	
					this._oDialog4.setTitle("Fluxo:");
						
					var __this = this;
					var oData = {};
					var value = [];
					var oModel = new JSONModel();
					oData.Itens = value;
					oModel.setData(oData);
	
					__this.getView().setBusy(true);
					Results.buscaFluxoDocumento(sDocumento).then(
						function(data) {
	
							oData.Itens = data;
							oModel.setData(oData);
							__this._oDialog4.setModel(oModel, "ModelFluxo");
							__this.getView().setBusy(false);
							__this._oDialog4.open();
						},
						function(error) {
							__this.getView().setBusy(false);
							__this._oDialog4.open();
						}
					);
	
				},

				closeDialogFluxo: function() {
					this._oDialog4.close();
				},
	
				afterCloseFluxo: function(oEvent) {
					this._oDialog4.destroy();
				},

				onSearch: function (oEvent) {
					var filter;
					var oTableSearchState = [],
						sQuery = oEvent.getParameter("query");
		
					if (sQuery && sQuery.length > 0) {
						
						var select = this.getView().byId("combobox1").getSelectedKey();

						filter = new sap.ui.model.Filter(
							select,
							sap.ui.model.FilterOperator.Contains,
							sQuery
						);
					
						oTableSearchState.push(filter);
					}
		
					this.getView().byId("idLista").getBinding("items").filter(oTableSearchState, "Application");
				},

				onPagamento: function(oEvent){

					var sPath,
						sPedidos = '';

					var valoresSelecionados = this.byId("idLista").getSelectedContexts();
					if (valoresSelecionados.length === 0) {
						MessageBox.alert("Favor Selecionar a linha");
						return;
					}

					valoresSelecionados.map(function(resultItem) {
						var sPatch = resultItem.sPath;
						var oSource = oEvent.getSource();
						var oModelOrig = oSource.getModel("ModelItens");
						var oRow = oModelOrig.getProperty(sPatch);
						
						if(!!oRow.Cotacao)
							sPedidos += ';' + oRow.Cotacao
					});

					sPath = "/PagamentoSet('" + sPedidos.substring(1) + "')";

					Results.buscaPagamento(sPath).then(
						function(data) {
							this._showCondPagto(data);
						}.bind(this),
						function(error) {
							var sMsg = JSON.parse(error.responseText);
							this._showMessageError(sMsg);
						}.bind(this)
					);
				}
				
			},
			
		);
	}
);