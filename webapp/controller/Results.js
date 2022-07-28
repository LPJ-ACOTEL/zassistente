sap.ui.define(
	[
		"sap/ui/core/mvc/Controller",
		"sap/m/MessageToast",
		"sap/ui/model/json/JSONModel",
		"com/assistente/model/formatter",
	],
	function(Results, MessageToast, JSONModel,formatter,) {
		"use strict";

		return {

			formatter: formatter,

			buscaTipoOrdem: function(path) {
				return new Promise(function(resolve, reject) {
					var sUrl = "/sap/opu/odata/SAP/Z_ASSISTENTE_VENDAS_SRV/";
					var oModel = new sap.ui.model.odata.v2.ODataModel(sUrl);
					oModel.setUseBatch(false);

					oModel.read("/ZVND_CDS_C_TPORDEM", {
						success: function(oData) {
							var dataToReturn = [];
							var dados;

							oData.results.map(function(resultItem) {
								dados = {
									cod: resultItem.TipoCotacao,
									desc: resultItem.DescTpCotacao,
								};
								dataToReturn.push(dados);
							});

							dataToReturn.sort(function(a, b) {
								return +(a.cod > b.cod) || +(a.cod === b.cod) - 1;
							});

							resolve(dataToReturn);
						},
						error: function(err) {
							reject(err);
						},
					});
				});
			},

			buscaTipoContacao: function(path) {
				return new Promise(function(resolve, reject) {
					var sUrl = "/sap/opu/odata/SAP/Z_ASSISTENTE_VENDAS_SRV/";
					var oModel = new sap.ui.model.odata.v2.ODataModel(sUrl);
					oModel.setUseBatch(false);

					oModel.read("/ZVND_CDS_C_TPCOTACAO", {
						success: function(oData) {
							var dataToReturn = [];
							var dados;

							oData.results.map(function(resultItem) {
								dados = {
									cod: resultItem.TipoCotacao,
									desc: resultItem.DescTpCotacao,
								};
								dataToReturn.push(dados);
							});

							dataToReturn.sort(function(a, b) {
								return +(a.cod > b.cod) || +(a.cod === b.cod) - 1;
							});

							resolve(dataToReturn);
						},
						error: function(err) {
							reject(err);
						},
					});
				});
			},

			buscaOrgVendas: function(path) {
				return new Promise(function(resolve, reject) {
					var sUrl = "/sap/opu/odata/SAP/Z_ASSISTENTE_VENDAS_SRV/";
					var oModel = new sap.ui.model.odata.v2.ODataModel(sUrl);
					oModel.setUseBatch(false);

					oModel.read("/ZVND_CDS_C_ORGVENDAS", {
						success: function(oData) {
							var dataToReturn = [];
							var dados;

							oData.results.map(function(resultItem) {
								dados = {
									cod: resultItem.OrgVendas,
									desc: resultItem.DescOrgVendas,
								};
								dataToReturn.push(dados);
							});

							dataToReturn.sort(function(a, b) {
								return +(a.cod > b.cod) || +(a.cod === b.cod) - 1;
							});

							resolve(dataToReturn);
						},
						error: function(err) {
							reject(err);
						},
					});
				});
			},

			buscaCanal: function(path) {
				return new Promise(function(resolve, reject) {
					var sUrl = "/sap/opu/odata/SAP/Z_ASSISTENTE_VENDAS_SRV/";
					var oModel = new sap.ui.model.odata.v2.ODataModel(sUrl);
					oModel.setUseBatch(false);

					oModel.read("/ZVND_CDS_C_CANALDIST", {
						success: function(oData) {
							var dataToReturn = [];
							var dados;

							oData.results.map(function(resultItem) {
								dados = {
									cod: resultItem.CanalDist,
									desc: resultItem.DescCanalDist,
								};
								dataToReturn.push(dados);
							});

							dataToReturn.sort(function(a, b) {
								return +(a.cod > b.cod) || +(a.cod === b.cod) - 1;
							});

							resolve(dataToReturn);
						},
						error: function(err) {
							reject(err);
						},
					});
				});
			},

			buscaSetor: function(path) {
				return new Promise(function(resolve, reject) {
					var sUrl = "/sap/opu/odata/SAP/Z_ASSISTENTE_VENDAS_SRV/";
					var oModel = new sap.ui.model.odata.v2.ODataModel(sUrl);
					oModel.setUseBatch(false);

					oModel.read("/ZVND_CDS_C_SETORATIVIDADE", {
						success: function(oData) {
							var dataToReturn = [];
							var dados;

							oData.results.map(function(resultItem) {
								dados = {
									cod: resultItem.SetorAtiv,
									desc: resultItem.DescSetorAtiv,
								};
								dataToReturn.push(dados);
							});

							dataToReturn.sort(function(a, b) {
								return +(a.cod > b.cod) || +(a.cod === b.cod) - 1;
							});

							resolve(dataToReturn);
						},
						error: function(err) {
							reject(err);
						},
					});
				});
			},

			buscaEscritorio: function(path) {
				return new Promise(function(resolve, reject) {
					var sUrl = "/sap/opu/odata/SAP/Z_ASSISTENTE_VENDAS_SRV/";
					var oModel = new sap.ui.model.odata.v2.ODataModel(sUrl);
					oModel.setUseBatch(false);

					oModel.read("/ZVND_CDS_C_VENDEDORES", {
						success: function(oData) {
							var dataToReturn = [];
							var dados;

							oData.results.map(function(resultItem) {
								
									dados = {
										cod: resultItem.EscritorioVendas,
										desc: resultItem.Texto,
									};
									dataToReturn.push(dados);
								
							});

							dataToReturn.sort(function(a, b) {
								return +(a.cod > b.cod) || +(a.cod === b.cod) - 1;
							});

							resolve(dataToReturn);
						},
						error: function(err) {
							reject(err);
						},
					});
				});
			},

			buscaEmissor: function(sCodigo, sNome, sCPF, sCNPJ) {
				return new Promise(function(resolve, reject) {
					var sUrl = "/sap/opu/odata/SAP/Z_ASSISTENTE_VENDAS_SRV/";
					var oModel = new sap.ui.model.odata.v2.ODataModel(sUrl);
					oModel.setUseBatch(false);
					var filters = [];
					var filter = "";

					if (sCodigo !== "") {
						filter = new sap.ui.model.Filter(
							"Emissor",
							sap.ui.model.FilterOperator.EQ,
							sCodigo
						);
						filters.push(filter);
					}

					if (sNome !== "") {
						sNome = sNome.toUpperCase();
						filter = new sap.ui.model.Filter(
							"Nome1",
							sap.ui.model.FilterOperator.Contains,
							sNome
						);
						filters.push(filter);
					}

					if (sCPF !== "" && sCPF !== undefined) {
						filter = new sap.ui.model.Filter(
							"CPF",
							sap.ui.model.FilterOperator.EQ,
							sCPF
						);
						filters.push(filter);
					}

					if (sCNPJ !== "" && sCPF !== sCNPJ) {
						filter = new sap.ui.model.Filter(
							"CNPJ",
							sap.ui.model.FilterOperator.EQ,
							sCNPJ
						);
						filters.push(filter);
					}

					oModel.read("/ZVND_CDS_C_EMISSOR", {
						filters: filters,
						success: function(oData) {
							var dataToReturn = [];
							var dados;
							var cnpj;

							oData.results.map(function(resultItem) {

								if (resultItem.CNPJ !== "") {
									cnpj = resultItem.CNPJ;
								} else {
									cnpj = resultItem.CPF
								}

								dados = {
									cod: resultItem.Emissor,
									desc: resultItem.Nome1 + resultItem.Nome2,
									cnpj: cnpj,
								};
								dataToReturn.push(dados);
							});

							dataToReturn.sort(function(a, b) {
								return +(a.cod > b.cod) || +(a.cod === b.cod) - 1;
							});

							resolve(dataToReturn);
						},
						error: function(err) {
							reject(err);
						},
					});
				});
			},

			buscaRecebedor: function(sCodigo, sNome) {
				return new Promise(function(resolve, reject) {
					var sUrl = "/sap/opu/odata/SAP/Z_ASSISTENTE_VENDAS_SRV/";
					var oModel = new sap.ui.model.odata.v2.ODataModel(sUrl);
					oModel.setUseBatch(false);
					var filters = [];
					var filter = "";

					if (sCodigo !== "") {
						filter = new sap.ui.model.Filter(
							"Emissor",
							sap.ui.model.FilterOperator.EQ,
							sCodigo
						);
						filters.push(filter);
					}

					if (sNome !== "") {
						sNome = sNome.toUpperCase();
						filter = new sap.ui.model.Filter(
							"Nome1",
							sap.ui.model.FilterOperator.Contains,
							sNome
						);
						filters.push(filter);
					}

					oModel.read("/ZVND_CDS_C_RECMERC", {
						filters: filters,
						success: function(oData) {
							var dataToReturn = [];
							var dados;

							oData.results.map(function(resultItem) {
								dados = {
									cod: resultItem.Emissor,
									desc: resultItem.Nome1 + resultItem.Nome2,
								};
								dataToReturn.push(dados);
							});

							dataToReturn.sort(function(a, b) {
								return +(a.cod > b.cod) || +(a.cod === b.cod) - 1;
							});

							resolve(dataToReturn);
						},
						error: function(err) {
							reject(err);
						},
					});
				});
			},

			buscaFormaPag: function(path) {
				return new Promise(function(resolve, reject) {
					var sUrl = "/sap/opu/odata/SAP/Z_ASSISTENTE_VENDAS_SRV/";
					var oModel = new sap.ui.model.odata.v2.ODataModel(sUrl);
					oModel.setUseBatch(false);

					oModel.read("/ZVND_CDS_C_FORMPAG", {
						success: function(oData) {
							var dataToReturn = [];
							var dados;

							oData.results.map(function(resultItem) {
								dados = {
									cod: resultItem.FormaPag,
									desc: resultItem.DescFormaPag,
								};
								dataToReturn.push(dados);
							});

							dataToReturn.sort(function(a, b) {
								return +(a.cod > b.cod) || +(a.cod === b.cod) - 1;
							});

							resolve(dataToReturn);
						},
						error: function(err) {
							reject(err);
						},
					});
				});
			},

			buscaCondPag: function(path) {
				return new Promise(function(resolve, reject) {
					var sUrl = "/sap/opu/odata/SAP/Z_ASSISTENTE_VENDAS_SRV/";
					var oModel = new sap.ui.model.odata.v2.ODataModel(sUrl);
					oModel.setUseBatch(false);

					oModel.read("/ZVND_CDS_C_CONDPAG", {
						success: function(oData) {
							var dataToReturn = [];
							var dados;

							oData.results.map(function(resultItem) {
								dados = {
									cod: resultItem.CondPagamento,
									desc: resultItem.DescCondPag,
								};
								dataToReturn.push(dados);
							});

							dataToReturn.sort(function(a, b) {
								return +(a.cod > b.cod) || +(a.cod === b.cod) - 1;
							});

							resolve(dataToReturn);
						},
						error: function(err) {
							reject(err);
						},
					});
				});
			},

			buscaUitilizacao: function(path) {
				return new Promise(function(resolve, reject) {
					var sUrl = "/sap/opu/odata/SAP/Z_ASSISTENTE_VENDAS_SRV/";
					var oModel = new sap.ui.model.odata.v2.ODataModel(sUrl);
					oModel.setUseBatch(false);

					oModel.read("/ZVND_CDS_C_UTILIZACAO", {
						success: function(oData) {
							var dataToReturn = [];
							var dados;

							oData.results.map(function(resultItem) {
								dados = {
									cod: resultItem.Utilizacao,
									desc: resultItem.DescUtilizacao,
								};
								dataToReturn.push(dados);
							});

							dataToReturn.sort(function(a, b) {
								return +(a.cod > b.cod) || +(a.cod === b.cod) - 1;
							});

							resolve(dataToReturn);
						},
						error: function(err) {
							reject(err);
						},
					});
				});
			},

			buscaMotivo: function(path) {
				return new Promise(function(resolve, reject) {
					var sUrl = "/sap/opu/odata/SAP/Z_ASSISTENTE_VENDAS_SRV/";
					var oModel = new sap.ui.model.odata.v2.ODataModel(sUrl);
					oModel.setUseBatch(false);

					oModel.read("/ZVND_CDS_C_MOTORDEM", {
						success: function(oData) {
							var dataToReturn = [];
							var dados;

							oData.results.map(function(resultItem) {
								dados = {
									cod: resultItem.MotivoOrdem,
									desc: resultItem.DescMotivoOrdem,
								};
								dataToReturn.push(dados);
							});

							// ordenando o array mapeado contendo os dados resumidos
							dataToReturn.sort(function(a, b) {
								return +(a.cod > b.cod) || +(a.cod === b.cod) - 1;
							});

							resolve(dataToReturn);
						},
						error: function(err) {
							reject(err);
						},
					});
				});
			},

			buscaVendedor: function(sCodigo, sNome) {
				return new Promise(function(resolve, reject) {
					var sUrl = "/sap/opu/odata/SAP/Z_ASSISTENTE_VENDAS_SRV/";
					var oModel = new sap.ui.model.odata.v2.ODataModel(sUrl);
					oModel.setUseBatch(false);
					var filters = [];
					var filter = "";

					if (sCodigo !== "") {
						filter = new sap.ui.model.Filter(
							"Parceiro",
							sap.ui.model.FilterOperator.EQ,
							sCodigo
						);
						filters.push(filter);
					}

					if (sNome !== "") {
						sNome = sNome.toUpperCase();
						filter = new sap.ui.model.Filter(
							"Nome1",
							sap.ui.model.FilterOperator.Contains,
							sNome
						);
						filters.push(filter);
					}

					oModel.read("/ZVND_CDS_C_PARCEIRO", {
						filters: filters,
						success: function(oData) {
							var dataToReturn = [];
							var dados;

							oData.results.map(function(resultItem) {
								dados = {
									cod: resultItem.Parceiro,
									desc: resultItem.Nome2 + " " + resultItem.Nome1,
								};
								dataToReturn.push(dados);
							});

							dataToReturn.sort(function(a, b) {
								return +(a.cod > b.cod) || +(a.cod === b.cod) - 1;
							});

							resolve(dataToReturn);
						},
						error: function(err) {
							reject(err);
						},
					});
				});
			},

			buscaIncoterms: function(path) {
				return new Promise(function(resolve, reject) {
					var sUrl = "/sap/opu/odata/SAP/Z_ASSISTENTE_VENDAS_SRV/";
					var oModel = new sap.ui.model.odata.v2.ODataModel(sUrl);
					oModel.setUseBatch(false);

					oModel.read("/ZVND_CDS_C_INCOTERMS", {
						success: function(oData) {
							var dataToReturn = [];
							var dados;

							oData.results.map(function(resultItem) {
								dados = {
									cod: resultItem.Incoterms,
									desc: resultItem.DescIncoterms,
								};
								dataToReturn.push(dados);
							});

							dataToReturn.sort(function(a, b) {
								return +(a.cod > b.cod) || +(a.cod === b.cod) - 1;
							});

							resolve(dataToReturn);
						},
						error: function(err) {
							reject(err);
						},
					});
				});
			},

			buscaLocalAlter: function(path) {
				return new Promise(function(resolve, reject) {
					var sUrl = "/sap/opu/odata/SAP/Z_ASSISTENTE_VENDAS_SRV/";
					var oModel = new sap.ui.model.odata.v2.ODataModel(sUrl);
					oModel.setUseBatch(false);

					oModel.read("/ZVND_CDS_C_LOCALALT", {
						success: function(oData) {
							var dataToReturn = [];
							var dados;

							oData.results.map(function(resultItem) {
								dados = {
									cod: resultItem.Parceiro,
									desc: resultItem.Nome1,
								};
								dataToReturn.push(dados);
							});

							dataToReturn.sort(function(a, b) {
								return +(a.cod > b.cod) || +(a.cod === b.cod) - 1;
							});

							resolve(dataToReturn);
						},
						error: function(err) {
							reject(err);
						},
					});
				});
			},

			buscaMaterial: function(sCodigo, sNome) {
				return new Promise(function(resolve, reject) {
					var sUrl = "/sap/opu/odata/SAP/Z_ASSISTENTE_VENDAS_SRV/";
					var oModel = new sap.ui.model.odata.v2.ODataModel(sUrl);
					oModel.setUseBatch(false);
					var filters = [];
					var filter = "";

					if (sCodigo !== "") {
						filter = new sap.ui.model.Filter(
							"Material",
							sap.ui.model.FilterOperator.EQ,
							sCodigo
						);
						filters.push(filter);
					}

					if (sNome !== "") {
						sNome = sNome.toUpperCase();
						filter = new sap.ui.model.Filter(
							"DescMaterial",
							sap.ui.model.FilterOperator.Contains,
							sNome
						);
						filters.push(filter);
					}

					oModel.read("/ZVND_CDS_C_MATERIAL", {
						filters: filters,
						success: function(oData) {
							var dataToReturn = [];
							var dados;

							oData.results.map(function(resultItem) {
								dados = {
									cod: resultItem.Material,
									desc: resultItem.DescMaterial,
								};
								dataToReturn.push(dados);
							});

							dataToReturn.sort(function(a, b) {
								return +(a.cod > b.cod) || +(a.cod === b.cod) - 1;
							});

							resolve(dataToReturn);
						},
						error: function(err) {
							reject(err);
						},
					});
				});
			},

			buscaCentro: function(path) {
				return new Promise(function(resolve, reject) {
					var sUrl = "/sap/opu/odata/SAP/Z_ASSISTENTE_VENDAS_SRV/";
					var oModel = new sap.ui.model.odata.v2.ODataModel(sUrl);
					oModel.setUseBatch(false);

					oModel.read("/ZVND_CDS_C_VENDEDORES", {
						success: function(oData) {
							var dataToReturn = [];
							var dados;

							oData.results.map(function(resultItem) {
								
									dados = {
										cod: resultItem.Centro,
										desc: resultItem.DescCentro,
									};
									dataToReturn.push(dados);
								
							});

							dataToReturn.sort(function(a, b) {
								return +(a.cod > b.cod) || +(a.cod === b.cod) - 1;
							});

							resolve(dataToReturn);
						},
						error: function(err) {
							reject(err);
						},
					});
				});
			},

			buscaEstoque: function(path) {
				return new Promise(function(resolve, reject) {
					var sUrl = "/sap/opu/odata/SAP/Z_ASSISTENTE_VENDAS_SRV/";
					var oModel = new sap.ui.model.odata.v2.ODataModel(sUrl);
					oModel.setUseBatch(false);

					oModel.read("/ZVND_CDS_C_ESTOQUE", {
						success: function(oData) {
							var dataToReturn = [];
							var dados;

							oData.results.map(function(resultItem) {
								dataToReturn.push(resultItem);
							});

							resolve(dataToReturn);
						},
						error: function(err) {
							reject(err);
						},
					});
				});
			},

			buscaUnidadeMedida: function(iMaterial) {
				return new Promise(function(resolve, reject) {
					var filters = [];
					var filter = "";
					filter = new sap.ui.model.Filter(
						"Material",
						sap.ui.model.FilterOperator.EQ,
						iMaterial
					);
					filters.push(filter);

					var sUrl = "/sap/opu/odata/SAP/Z_ASSISTENTE_VENDAS_SRV/";
					var oModel = new sap.ui.model.odata.v2.ODataModel(sUrl);
					oModel.setUseBatch(false);

					oModel.read("/ZVND_CDS_C_UNIDADEMED", {
						filters: filters,
						success: function(oData) {
							var dataToReturn = [];
							var dados;

							oData.results.map(function(resultItem) {
								dados = {
									cod: resultItem.Un,
									//desc: resultItem.Un
								};
								dataToReturn.push(dados);
							});

							resolve(dataToReturn);
						},
						error: function(err) {
							reject(err);
						},
					});
				});
			},

			buscaUnidadeMedidaVenda: function(iMaterial, iOrgVendas, iCanalDist) {
				return new Promise(function(resolve, reject) {
					var filters = [];
					var filter = "";
					filter = new sap.ui.model.Filter(
						"Material",
						sap.ui.model.FilterOperator.EQ,
						iMaterial
					);
					filters.push(filter);

					filter = new sap.ui.model.Filter(
						"OrgVendas",
						sap.ui.model.FilterOperator.EQ,
						iOrgVendas
					);
					filters.push(filter);

					filter = new sap.ui.model.Filter(
						"CanalDist",
						sap.ui.model.FilterOperator.EQ,
						iCanalDist
					);
					filters.push(filter);

					var sUrl = "/sap/opu/odata/SAP/Z_ASSISTENTE_VENDAS_SRV/";
					var oModel = new sap.ui.model.odata.v2.ODataModel(sUrl);
					oModel.setUseBatch(false);

					oModel.read("/ZVND_CDS_C_UNIDADEVEND", {
						filters: filters,
						success: function(oData) {
							var dataToReturn = [];
							var dados;

							oData.results.map(function(resultItem) {
								dados = {
									Un: resultItem.Un,
								};
								dataToReturn.push(dados);
							});

							resolve(dataToReturn);
						},
						error: function(err) {
							reject(err);
						},
					});
				});
			},

			buscaPreco: function(
				iMaterial,
				iOrgVendas,
				iCanalDist,
				iCentro,
				iEmissor
			) {
				return new Promise(function(resolve, reject) {
					var filters = [];
					var filter = "";
					filter = new sap.ui.model.Filter(
						"Material",
						sap.ui.model.FilterOperator.EQ,
						iMaterial
					);
					filters.push(filter);

					filter = new sap.ui.model.Filter(
						"OrgVendas",
						sap.ui.model.FilterOperator.EQ,
						iOrgVendas
					);
					filters.push(filter);

					filter = new sap.ui.model.Filter(
						"CanalDist",
						sap.ui.model.FilterOperator.EQ,
						iCanalDist
					);
					filters.push(filter);

					filter = new sap.ui.model.Filter(
						"Centro",
						sap.ui.model.FilterOperator.EQ,
						iCentro
					);
					filters.push(filter);

					filter = new sap.ui.model.Filter(
						"Emissor",
						sap.ui.model.FilterOperator.EQ,
						iEmissor
					);
					filters.push(filter);

					var sUrl = "/sap/opu/odata/SAP/Z_ASSISTENTE_VENDAS_SRV/";
					var oModel = new sap.ui.model.odata.v2.ODataModel(sUrl);
					oModel.setUseBatch(false);

					oModel.read("/BuscaPrecoMaterialSet", {
						filters: filters,
						success: function(oData) {
							var dataToReturn = [];
							var dados;

							oData.results.map(function(resultItem) {
								dataToReturn.push(resultItem);
							});

							resolve(dataToReturn);
						},
						error: function(err) {
							reject(err);
						},
					});
				});
			},

			buscaConversao: function(iMaterial, idUm, idUMC, idQtd, idQtdC) {
				return new Promise(function(resolve, reject) {
					var filters = [];
					var filter = "";
					filter = new sap.ui.model.Filter(
						"Material",
						sap.ui.model.FilterOperator.EQ,
						iMaterial
					);
					filters.push(filter);

					if (idUm !== "") {
						filter = new sap.ui.model.Filter(
							"UmIn",
							sap.ui.model.FilterOperator.EQ,
							idUm
						);
						filters.push(filter);
					}

					if (idUMC !== "") {
						filter = new sap.ui.model.Filter(
							"UmOut",
							sap.ui.model.FilterOperator.EQ,
							idUMC
						);
						filters.push(filter);
					}

					if (idQtd !== "") {
						filter = new sap.ui.model.Filter(
							"QuantidadeIn",
							sap.ui.model.FilterOperator.EQ,
							idQtd
						);
						filters.push(filter);
					}

					var sUrl = "/sap/opu/odata/SAP/Z_ASSISTENTE_VENDAS_SRV/";
					var oModel = new sap.ui.model.odata.v2.ODataModel(sUrl);
					oModel.setUseBatch(false);

					oModel.read("/ConverteMaterialSet", {
						filters: filters,
						success: function(oData) {
							var dataToReturn = [];
							var dados;

							oData.results.map(function(resultItem) {
								dados = {
									Qtd: resultItem.QuantidadeOut,
								};
								dataToReturn.push(dados);
							});

							resolve(dataToReturn);
						},
						error: function(err) {
							reject(err);
						},
					});
				});
			},

			buscaTextoMaterialCliente: function(
				iMaterial,
				idCanal,
				idCliente,
				idOrgVend
			) {
				return new Promise(function(resolve, reject) {
					var filters = [];
					var filter = "";
					filter = new sap.ui.model.Filter(
						"Material",
						sap.ui.model.FilterOperator.EQ,
						iMaterial
					);
					filters.push(filter);

					if (idCanal !== "") {
						filter = new sap.ui.model.Filter(
							"Canal",
							sap.ui.model.FilterOperator.EQ,
							idCanal
						);
						filters.push(filter);
					}

					if (idCliente !== "") {
						filter = new sap.ui.model.Filter(
							"Cliente",
							sap.ui.model.FilterOperator.EQ,
							idCliente
						);
						filters.push(filter);
					}

					if (idOrgVend !== "") {
						filter = new sap.ui.model.Filter(
							"OrgVendas",
							sap.ui.model.FilterOperator.EQ,
							idOrgVend
						);
						filters.push(filter);
					}

					var sUrl = "/sap/opu/odata/SAP/Z_ASSISTENTE_VENDAS_SRV/";
					var oModel = new sap.ui.model.odata.v2.ODataModel(sUrl);
					oModel.setUseBatch(false);

					oModel.read("/BuscaTextoClienteMaterialSet", {
						filters: filters,
						success: function(oData) {
							var dataToReturn = [];
							var dados;
							var concatenaTexto = "";
							var vLength = oData.results.length;
							var count = 0;
							oData.results.map(function(resultItem) {
								count = count + 1;
								if (count === 1) {
									concatenaTexto = resultItem.Texto;
								} else {
									concatenaTexto = concatenaTexto + "\n" + resultItem.Texto;
								}
							});

							dados = {
								Texto: concatenaTexto,
							};

							dataToReturn.push(dados);

							resolve(dataToReturn);
						},
						error: function(err) {
							reject(err);
						},
					});
				});
			},

			buscaDadosItens: function(dados) {
				return new Promise(function(resolve, reject) {
					var sUrl = "/sap/opu/odata/SAP/Z_ASSISTENTE_VENDAS_SRV/";
					var oModel = new sap.ui.model.odata.v2.ODataModel(sUrl);
					oModel.setUseBatch(false);

					var oEntry1 = {};
					//var item = [];
					//fazer um for
					//item.push({
					//	Cotacao: "12",
					//	Itens: "2",
					//	Material: "1"
					//});

					oEntry1.Cotacao = "12";
					oEntry1.HeaderToItem = dados;

					oModel.create("/HeaderSet", oEntry1, {
						success: function(oData) {
							var dataToReturn = [];
							var dados;

							oData.HeaderToItem.results.map(function(resultItem) {
								dataToReturn.push(resultItem);
							});

							resolve(dataToReturn);
						},
						error: function(err) {
							reject(err);
						},
					});
				});
			},

			buscaTextoEmissor: function(idEmissor) {
				return new Promise(function(resolve, reject) {
					var filters = [];
					var filter = "";
					filter = new sap.ui.model.Filter(
						"Emissor",
						sap.ui.model.FilterOperator.EQ,
						idEmissor
					);
					filters.push(filter);

					var sUrl = "/sap/opu/odata/SAP/Z_ASSISTENTE_VENDAS_SRV/";
					var oModel = new sap.ui.model.odata.v2.ODataModel(sUrl);
					oModel.setUseBatch(false);

					oModel.read("/BuscaTextoEmissorSet", {
						filters: filters,
						success: function(oData) {
							var dataToReturn = [];
							var dados;

							oData.results.map(function(resultItem) {
								dados = {
									Cod: resultItem.Cod,
									Lines: resultItem.Lines,
								};
								dataToReturn.push(dados);
							});

							resolve(dataToReturn);
						},
						error: function(err) {
							reject(err);
						},
					});
				});
			},

			criaCotacao: function(dados) {
				return new Promise(function(resolve, reject) {
					var sUrl = "/sap/opu/odata/SAP/Z_ASSISTENTE_VENDAS_SRV/";
					var oModel = new sap.ui.model.odata.v2.ODataModel(sUrl);
					oModel.setUseBatch(false);

					var oEntry1 = {};

					oEntry1.Cotacao = "12";
					oEntry1.CotacaoItem = dados;

					oModel.create("/CriaCotacaoSet", oEntry1, {
						success: function(oData) {
							var dataToReturn = [];
							var dados;

							oData.CotacaoItem.results.map(function(resultItem) {
								dataToReturn.push(resultItem);
							});

							resolve(dataToReturn);
						},
						error: function(err) {
							reject(err);
						},
					});
				});
			},

			buscaLimiteCarga: function(path) {
				return new Promise(function(resolve, reject) {
					var sUrl = "/sap/opu/odata/SAP/Z_ASSISTENTE_VENDAS_SRV/";
					var oModel = new sap.ui.model.odata.v2.ODataModel(sUrl);
					oModel.setUseBatch(false);

					oModel.read("/ZVND_CDS_C_LIMITE_CARGA", {
						success: function(oData) {
							var dataToReturn = [];
							var dados;

							oData.results.map(function(resultItem) {
								dados = {
									cod: resultItem.Codigo,
									desc: resultItem.Descricao,
								};
								dataToReturn.push(dados);
							});

							dataToReturn.sort(function(a, b) {
								return +(a.cod > b.cod) || +(a.cod === b.cod) - 1;
							});

							resolve(dataToReturn);
						},
						error: function(err) {
							reject(err);
						},
					});
				});
			},

			buscaLimiteVeiculo: function(path) {
				return new Promise(function(resolve, reject) {
					var sUrl = "/sap/opu/odata/SAP/Z_ASSISTENTE_VENDAS_SRV/";
					var oModel = new sap.ui.model.odata.v2.ODataModel(sUrl);
					oModel.setUseBatch(false);

					oModel.read("/ZVND_CDS_C_LIMITE_VEIC", {
						success: function(oData) {
							var dataToReturn = [];
							var dados;

							oData.results.map(function(resultItem) {
								dados = {
									cod: resultItem.Codigo,
									desc: resultItem.Descricao,
								};
								dataToReturn.push(dados);
							});

							dataToReturn.sort(function(a, b) {
								return +(a.cod > b.cod) || +(a.cod === b.cod) - 1;
							});

							resolve(dataToReturn);
						},
						error: function(err) {
							reject(err);
						},
					});
				});
			},

			buscaSegmento: function(path) {
				return new Promise(function(resolve, reject) {
					var sUrl = "/sap/opu/odata/SAP/Z_ASSISTENTE_VENDAS_SRV/";
					var oModel = new sap.ui.model.odata.v2.ODataModel(sUrl);
					oModel.setUseBatch(false);

					oModel.read("/ZVND_CDS_C_SEGMENTO", {
						success: function(oData) {
							var dataToReturn = [];
							var dados;

							oData.results.map(function(resultItem) {
								dados = {
									cod: resultItem.Codigo,
									desc: resultItem.Descricao,
								};
								dataToReturn.push(dados);
							});

							dataToReturn.sort(function(a, b) {
								return +(a.cod > b.cod) || +(a.cod === b.cod) - 1;
							});

							resolve(dataToReturn);
						},
						error: function(err) {
							reject(err);
						},
					});
				});
			},

			buscaRestricao1: function(path) {
				return new Promise(function(resolve, reject) {
					var sUrl = "/sap/opu/odata/SAP/Z_ASSISTENTE_VENDAS_SRV/";
					var oModel = new sap.ui.model.odata.v2.ODataModel(sUrl);
					oModel.setUseBatch(false);

					oModel.read("/ZVND_CDS_C_RESTRICAO1", {
						success: function(oData) {
							var dataToReturn = [];
							var dados;

							oData.results.map(function(resultItem) {
								dados = {
									cod: resultItem.Codigo,
									desc: resultItem.Descricao,
								};
								dataToReturn.push(dados);
							});

							dataToReturn.sort(function(a, b) {
								return +(a.cod > b.cod) || +(a.cod === b.cod) - 1;
							});

							resolve(dataToReturn);
						},
						error: function(err) {
							reject(err);
						},
					});
				});
			},

			buscaRestricao2: function(path) {
				return new Promise(function(resolve, reject) {
					var sUrl = "/sap/opu/odata/SAP/Z_ASSISTENTE_VENDAS_SRV/";
					var oModel = new sap.ui.model.odata.v2.ODataModel(sUrl);
					oModel.setUseBatch(false);

					oModel.read("/ZVND_CDS_C_RESTRICAO2", {
						success: function(oData) {
							var dataToReturn = [];
							var dados;

							oData.results.map(function(resultItem) {
								dados = {
									cod: resultItem.Codigo,
									desc: resultItem.Descricao,
								};
								dataToReturn.push(dados);
							});

							dataToReturn.sort(function(a, b) {
								return +(a.cod > b.cod) || +(a.cod === b.cod) - 1;
							});

							resolve(dataToReturn);
						},
						error: function(err) {
							reject(err);
						},
					});
				});
			},

			buscaRestricao3: function(path) {
				return new Promise(function(resolve, reject) {
					var sUrl = "/sap/opu/odata/SAP/Z_ASSISTENTE_VENDAS_SRV/";
					var oModel = new sap.ui.model.odata.v2.ODataModel(sUrl);
					oModel.setUseBatch(false);

					oModel.read("/ZVND_CDS_C_RESTRICAO3", {
						success: function(oData) {
							var dataToReturn = [];
							var dados;

							oData.results.map(function(resultItem) {
								dados = {
									cod: resultItem.Codigo,
									desc: resultItem.Descricao,
								};
								dataToReturn.push(dados);
							});

							dataToReturn.sort(function(a, b) {
								return +(a.cod > b.cod) || +(a.cod === b.cod) - 1;
							});

							resolve(dataToReturn);
						},
						error: function(err) {
							reject(err);
						},
					});
				});
			},

			buscaRestricao4: function(path) {
				return new Promise(function(resolve, reject) {
					var sUrl = "/sap/opu/odata/SAP/Z_ASSISTENTE_VENDAS_SRV/";
					var oModel = new sap.ui.model.odata.v2.ODataModel(sUrl);
					oModel.setUseBatch(false);

					oModel.read("/ZVND_CDS_C_RESTRICAO4", {
						success: function(oData) {
							var dataToReturn = [];
							var dados;

							oData.results.map(function(resultItem) {
								dados = {
									cod: resultItem.Codigo,
									desc: resultItem.Descricao,
								};
								dataToReturn.push(dados);
							});

							dataToReturn.sort(function(a, b) {
								return +(a.cod > b.cod) || +(a.cod === b.cod) - 1;
							});

							resolve(dataToReturn);
						},
						error: function(err) {
							reject(err);
						},
					});
				});
			},

			buscaRestricao5: function(path) {
				return new Promise(function(resolve, reject) {
					var sUrl = "/sap/opu/odata/SAP/Z_ASSISTENTE_VENDAS_SRV/";
					var oModel = new sap.ui.model.odata.v2.ODataModel(sUrl);
					oModel.setUseBatch(false);

					oModel.read("/ZVND_CDS_C_RESTRICAO5", {
						success: function(oData) {
							var dataToReturn = [];
							var dados;

							oData.results.map(function(resultItem) {
								dados = {
									cod: resultItem.Codigo,
									desc: resultItem.Descricao,
								};
								dataToReturn.push(dados);
							});

							dataToReturn.sort(function(a, b) {
								return +(a.cod > b.cod) || +(a.cod === b.cod) - 1;
							});

							resolve(dataToReturn);
						},
						error: function(err) {
							reject(err);
						},
					});
				});
			},

			buscaCertificado: function(path) {
				return new Promise(function(resolve, reject) {
					var sUrl = "/sap/opu/odata/SAP/Z_ASSISTENTE_VENDAS_SRV/";
					var oModel = new sap.ui.model.odata.v2.ODataModel(sUrl);
					oModel.setUseBatch(false);

					oModel.read("/ZVND_CDS_C_CERTIFICADO", {
						success: function(oData) {
							var dataToReturn = [];
							var dados;

							oData.results.map(function(resultItem) {
								dados = {
									cod: resultItem.Codigo,
									desc: resultItem.Descricao,
								};
								dataToReturn.push(dados);
							});

							dataToReturn.sort(function(a, b) {
								return +(a.cod > b.cod) || +(a.cod === b.cod) - 1;
							});

							resolve(dataToReturn);
						},
						error: function(err) {
							reject(err);
						},
					});
				});
			},

			buscaRecebimento: function(path) {
				return new Promise(function(resolve, reject) {
					var sUrl = "/sap/opu/odata/SAP/Z_ASSISTENTE_VENDAS_SRV/";
					var oModel = new sap.ui.model.odata.v2.ODataModel(sUrl);
					oModel.setUseBatch(false);

					oModel.read("/ZVND_CDS_C_RECEBIMENTO", {
						success: function(oData) {
							var dataToReturn = [];
							var dados;

							oData.results.map(function(resultItem) {
								dados = {
									cod: resultItem.Codigo,
									desc: resultItem.Descricao,
								};
								dataToReturn.push(dados);
							});

							dataToReturn.sort(function(a, b) {
								return +(a.cod > b.cod) || +(a.cod === b.cod) - 1;
							});

							resolve(dataToReturn);
						},
						error: function(err) {
							reject(err);
						},
					});
				});
			},

			buscaDadosAdicionais: function(idCliente) {
				return new Promise(function(resolve, reject) {
					var filters = [];
					var filter = "";
					filter = new sap.ui.model.Filter(
						"Cliente",
						sap.ui.model.FilterOperator.EQ,
						idCliente
					);
					filters.push(filter);

					var sUrl = "/sap/opu/odata/SAP/Z_ASSISTENTE_VENDAS_SRV/";
					var oModel = new sap.ui.model.odata.v2.ODataModel(sUrl);
					oModel.setUseBatch(false);

					oModel.read("/ZVND_CDS_C_CERT_SEG", {
						filters: filters,
						success: function(oData) {
							var dataToReturn = [];
							var dados;

							oData.results.map(function(resultItem) {
								dados = {
									Certificado: resultItem.Certificado,
									LimiteCarga: resultItem.LimiteCarga,
									LimiteVeiculo: resultItem.LimiteVeiculo,
									Recebimento: resultItem.Recebimento,
									Segmento: resultItem.Segmento,
									Restricao1: resultItem.Restricao1,
									Restricao2: resultItem.Restricao2,
									Restricao3: resultItem.Restricao3,
									Restricao4: resultItem.Restricao4,
									Restricao5: resultItem.Restricao5,
								};
								dataToReturn.push(dados);
							});

							resolve(dataToReturn);
						},
						error: function(err) {
							reject(err);
						},
					});
				});
			},

			buscaIndicacaoComercial: function(path) {
				return new Promise(function(resolve, reject) {
					var sUrl = "/sap/opu/odata/SAP/Z_ASSISTENTE_VENDAS_SRV/";
					var oModel = new sap.ui.model.odata.v2.ODataModel(sUrl);
					oModel.setUseBatch(false);

					oModel.read("/ZVND_CDS_C_IND_COMERC", {
						success: function(oData) {
							var dataToReturn = [];
							var dados;

							oData.results.map(function(resultItem) {

								dados = {
									cod: resultItem.Parceiro,
									desc: resultItem.Nome2 + " " + resultItem.Nome1,
								};
								dataToReturn.push(dados);

							});

							dataToReturn.sort(function(a, b) {
								return +(a.cod > b.cod) || +(a.cod === b.cod) - 1;
							});

							resolve(dataToReturn);
						},
						error: function(err) {
							reject(err);
						},
					});
				});
			},

			criaOrdem: function(dados) {
				return new Promise(function(resolve, reject) {
					var sUrl = "/sap/opu/odata/SAP/Z_ASSISTENTE_VENDAS_SRV/";
					var oModel = new sap.ui.model.odata.v2.ODataModel(sUrl);
					oModel.setUseBatch(false);

					var oEntry1 = {};

					oEntry1.Ordem = "12";
					oEntry1.OrdemItem = dados;

					oModel.create("/CriaOrdemSet", oEntry1, {
						success: function(oData) {
							var dataToReturn = [];
							var dados;

							oData.OrdemItem.results.map(function(resultItem) {
								dataToReturn.push(resultItem);
							});

							resolve(dataToReturn);
						},
						error: function(err) {
							reject(err);
						},
					});
				});
			},

			buscaDadosAdmCotacao: function(
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
			) {
				return new Promise(function(resolve, reject) {
					var filters = [];
					var filter = "";

					if (idCliente !== "") {
						filter = new sap.ui.model.Filter(
							"Cliente",
							sap.ui.model.FilterOperator.EQ,
							idCliente
						);
						filters.push(filter);
					}

					if (idDataDe !== "") {
						if (idDataAte === "") {
							idDataAte = idDataDe;
						}

						idDataDe =
							idDataDe.substr(3, 2) +
							"/" +
							idDataDe.substr(0, 2) +
							"/" +
							idDataDe.substr(6, 4);
						idDataAte =
							idDataAte.substr(3, 2) +
							"/" +
							idDataAte.substr(0, 2) +
							"/" +
							idDataAte.substr(6, 4);

						let dateI = new Date(idDataDe);
						dateI.setDate(dateI.getDate());
						let dateO = new Date(idDataAte);
						dateO.setDate(dateO.getDate());

						filter = new sap.ui.model.Filter(
							"DataValidade",
							sap.ui.model.FilterOperator.BT,
							dateI,
							dateO
						);
						filters.push(filter);
					}

					if (idCanal !== "") {
						filter = new sap.ui.model.Filter(
							"Canal",
							sap.ui.model.FilterOperator.EQ,
							idCanal
						);
						filters.push(filter);
					}

					if (idCriado !== "") {
						filter = new sap.ui.model.Filter(
							"CriadoPor",
							sap.ui.model.FilterOperator.EQ,
							idCriado
						);
						filters.push(filter);
					}

					if (idCriadoDe !== "") {
						if (idCriadoAte === "") {
							idCriadoAte = idCriadoDe;
						}

						idCriadoDe =
							idCriadoDe.substr(3, 2) +
							"/" +
							idCriadoDe.substr(0, 2) +
							"/" +
							idCriadoDe.substr(6, 4);
						idCriadoAte =
							idCriadoAte.substr(3, 2) +
							"/" +
							idCriadoAte.substr(0, 2) +
							"/" +
							idCriadoAte.substr(6, 4);

						let dateI = new Date(idCriadoDe);
						let dateO = new Date(idCriadoAte);
						dateI.setDate(dateI.getDate());
						dateO.setDate(dateO.getDate());

						filter = new sap.ui.model.Filter(
							"DataCriacao",
							sap.ui.model.FilterOperator.BT,
							dateI,
							dateO
						);
						filters.push(filter);
					}

					if (idPedido !== "") {
						filter = new sap.ui.model.Filter(
							"PedidoCliente",
							sap.ui.model.FilterOperator.EQ,
							idPedido
						);
						filters.push(filter);
					}

					if (idCentro !== "") {
						filter = new sap.ui.model.Filter(
							"Centro",
							sap.ui.model.FilterOperator.EQ,
							idCentro
						);
						filters.push(filter);
					}

					// if (idMotivo!==""){
					filter = new sap.ui.model.Filter(
						"MotivoRecusa",
						sap.ui.model.FilterOperator.EQ,
						idMotivo
					);
					filters.push(filter);
					// }

					if (idVendedor !== "") {
						filter = new sap.ui.model.Filter(
							"Vendedor",
							sap.ui.model.FilterOperator.EQ,
							idVendedor
						);
						filters.push(filter);
					}

					var sUrl = "/sap/opu/odata/SAP/Z_ASSISTENTE_VENDAS_SRV/";
					var oModel = new sap.ui.model.odata.v2.ODataModel(sUrl);
					oModel.setUseBatch(false);

					if (idCotacao !== "") {

						filter = new sap.ui.model.Filter(
							"TipoDoc",
							sap.ui.model.FilterOperator.EQ,
							"B"
						);
						filters.push(filter);

						if (idCotacao !== "") {
							filter = new sap.ui.model.Filter(
								"Documento",
								sap.ui.model.FilterOperator.EQ,
								idCotacao
							);
							filters.push(filter);
						}

						oModel.read("/ZVND_CDS_C_DADOS_COTACAO", {
							filters: filters,
							success: function(oData) {
								var dataToReturn = [];

								oData.results.map(function(resultItem) {
									dataToReturn.push(resultItem);
								});

								resolve(dataToReturn);
							},
							error: function(err) {
								reject(err);
							},
						});

					} else if (idOv !== "") {

						filter = new sap.ui.model.Filter(
							"TipoDoc",
							sap.ui.model.FilterOperator.EQ,
							"C"
						);
						filters.push(filter);

						filter = new sap.ui.model.Filter(
							"Documento",
							sap.ui.model.FilterOperator.EQ,
							idOv
						);
						filters.push(filter);

						oModel.read("/ZVND_CDS_C_DADOS_ORDEM", {
							filters: filters,
							success: function(oData) {
								var dataToReturn = [];

								oData.results.map(function(resultItem) {
									dataToReturn.push(resultItem);
								});

								resolve(dataToReturn);
							},
							error: function(err) {
								reject(err);
							},
						});

					} else {

						var dataToReturn2 = [];
						filter = new sap.ui.model.Filter(
							"TipoDoc",
							sap.ui.model.FilterOperator.EQ,
							"B"
						);

						filters.push(filter);

						oModel.read("/ZVND_CDS_C_DADOS_COTACAO", {
							filters: filters,
							success: function(oData) {

								oData.results.map(function(resultItem) {
									dataToReturn2.push(resultItem);
								});

								filter = new sap.ui.model.Filter(
									"TipoDoc",
									sap.ui.model.FilterOperator.EQ,
									"C"
								);
								filters.push(filter);

								oModel.read("/ZVND_CDS_C_DADOS_ORDEM", {
									filters: filters,
									success: function(oData) {

										oData.results.map(function(resultItem) {
											if (resultItem.CotacaoRef === "") {
												dataToReturn2.push(resultItem);
											}
										});

										resolve(dataToReturn2);
									},
									error: function(err) {
										reject(err);
									},
								});

							},
							error: function(err) {
								reject(err);
							},
						});

					}

				});
			},

			buscaDadosCotacao: function(idCotacao, idTipo) {
				return new Promise(function(resolve, reject) {
					var sUrl = "/sap/opu/odata/SAP/Z_ASSISTENTE_VENDAS_SRV/";
					var oModel = new sap.ui.model.odata.v2.ODataModel(sUrl);
					oModel.setUseBatch(false);

					var filters = [];
					var filter = "";
					filter = new sap.ui.model.Filter(
						"Cotacao",
						sap.ui.model.FilterOperator.EQ,
						idCotacao
					);
					filters.push(filter);

					filter = new sap.ui.model.Filter(
						"Doctype",
						sap.ui.model.FilterOperator.EQ,
						idTipo
					);
					filters.push(filter);

					oModel.read("/BuscaDadosCotacaoSet", {
						filters: filters,
						success: function(oData) {
							var dataToReturn = [];
							var dados;

							oData.results.map(function(resultItem) {
								dataToReturn.push(resultItem);
							});

							resolve(dataToReturn);
						},
						error: function(err) {
							reject(err);
						},
					});
				});
			},

			modificaCotacao: function(dados) {
				return new Promise(function(resolve, reject) {
					var sUrl = "/sap/opu/odata/SAP/Z_ASSISTENTE_VENDAS_SRV/";
					var oModel = new sap.ui.model.odata.v2.ODataModel(sUrl);
					oModel.setUseBatch(false);

					var oEntry1 = {};

					oEntry1.Cotacao = "12";
					oEntry1.ModificaItem = dados;

					oModel.create("/ModificaCotacaoSet", oEntry1, {
						success: function(oData) {
							var dataToReturn = [];
							var dados;

							oData.ModificaItem.results.map(function(resultItem) {
								dataToReturn.push(resultItem);
							});

							resolve(dataToReturn);
						},
						error: function(err) {
							reject(err);
						},
					});
				});
			},

			modificaOrdem: function(dados) {
				return new Promise(function(resolve, reject) {
					var sUrl = "/sap/opu/odata/SAP/Z_ASSISTENTE_VENDAS_SRV/";
					var oModel = new sap.ui.model.odata.v2.ODataModel(sUrl);
					oModel.setUseBatch(false);

					var oEntry1 = {};

					oEntry1.Cotacao = "12";
					oEntry1.ModificaItem = dados;

					oModel.create("/ModificaCotacaoSet", oEntry1, {
						success: function(oData) {
							var dataToReturn = [];
							var dados;

							oData.ModificaItem.results.map(function(resultItem) {
								dataToReturn.push(resultItem);
							});

							resolve(dataToReturn);
						},
						error: function(err) {
							reject(err);
						},
					});
				});
			},

			preenchimentoAutomatico: function(path) {
				return new Promise(function(resolve, reject) {
					var sUrl = "/sap/opu/odata/SAP/Z_ASSISTENTE_VENDAS_SRV/";
					var oModel = new sap.ui.model.odata.v2.ODataModel(sUrl);
					oModel.setUseBatch(false);

					oModel.read("/ZVND_CDS_C_PREENC_AUTO", {
						success: function(oData) {
							var dataToReturn = [];
							var dados;

							oData.results.map(function(resultItem) {
								dataToReturn.push(resultItem);
							});

							resolve(dataToReturn);
						},
						error: function(err) {
							reject(err);
						},
					});
				});
			},

			buscaBloqueio: function(path) {
				return new Promise(function(resolve, reject) {
					var sUrl = "/sap/opu/odata/SAP/Z_ASSISTENTE_VENDAS_SRV/";
					var oModel = new sap.ui.model.odata.v2.ODataModel(sUrl);
					oModel.setUseBatch(false);

					oModel.read("/ZVND_CDS_C_BLOQUEIO", {
						success: function(oData) {
							var dataToReturn = [];
							var dados;

							oData.results.map(function(resultItem) {
								if (resultItem.Valor === ""){
									dados = {
										cod: resultItem.Bloqueio,
										desc: resultItem.DescBloqueio,
									};
									dataToReturn.push(dados);
								}
							});

							dataToReturn.sort(function(a, b) {
								return +(a.cod > b.cod) || +(a.cod === b.cod) - 1;
							});

							resolve(dataToReturn);
						},
						error: function(err) {
							reject(err);
						},
					});
				});
			},

			buscaRecebedorEmissor: function(
				idEmissor,
				iOrgVendas,
				iCanalDist,
				idSetor
			) {
				return new Promise(function(resolve, reject) {
					var filters = [];
					var filter = "";
					filter = new sap.ui.model.Filter(
						"Emissor",
						sap.ui.model.FilterOperator.EQ,
						idEmissor
					);
					filters.push(filter);

					filter = new sap.ui.model.Filter(
						"OrgVendas",
						sap.ui.model.FilterOperator.EQ,
						iOrgVendas
					);
					filters.push(filter);

					filter = new sap.ui.model.Filter(
						"Canal",
						sap.ui.model.FilterOperator.EQ,
						iCanalDist
					);
					filters.push(filter);

					filter = new sap.ui.model.Filter(
						"Setor",
						sap.ui.model.FilterOperator.EQ,
						idSetor
					);
					filters.push(filter);

					var sUrl = "/sap/opu/odata/SAP/Z_ASSISTENTE_VENDAS_SRV/";
					var oModel = new sap.ui.model.odata.v2.ODataModel(sUrl);
					oModel.setUseBatch(false);

					oModel.read("/ZVND_CDS_C_BUSCA_RECEB", {
						filters: filters,
						success: function(oData) {
							var dataToReturn = [];

							oData.results.map(function(resultItem) {
								dataToReturn.push(resultItem);
							});

							resolve(dataToReturn);
						},
						error: function(err) {
							reject(err);
						},
					});
				});
			},

			prorrogaValidade: function(idOrdem, idDate) {
				return new Promise(function(resolve, reject) {
					var filters = [];
					var filter = "";
					filter = new sap.ui.model.Filter(
						"Ordem",
						sap.ui.model.FilterOperator.EQ,
						idOrdem
					);
					filters.push(filter);

					if (idDate !== "") {
						filter = new sap.ui.model.Filter(
							"Validade",
							sap.ui.model.FilterOperator.EQ,
							idDate
						);
						filters.push(filter);
					}

					var sUrl = "/sap/opu/odata/SAP/Z_ASSISTENTE_VENDAS_SRV/";
					var oModel = new sap.ui.model.odata.v2.ODataModel(sUrl);
					oModel.setUseBatch(false);

					oModel.read("/ProrrogaValidadeSet", {
						filters: filters,
						success: function(oData) {
							var dataToReturn = [];
							oData.results.map(function(resultItem) {
								dataToReturn.push(resultItem);
							});

							resolve(dataToReturn);
						},
						error: function(err) {
							reject(err);
						},
					});
				});
			},

			faturar: function(idOrdem) {
				return new Promise(function(resolve, reject) {
					var oEntry1 = {};
					oEntry1.Ordem = idOrdem;

					var sUrl = "/sap/opu/odata/SAP/Z_ASSISTENTE_VENDAS_SRV/";
					var oModel = new sap.ui.model.odata.v2.ODataModel(sUrl);
					oModel.setUseBatch(false);

					oModel.create("/FaturaSet", oEntry1, {
						success: function(oData, oResponse) {
							// Success
							resolve(oData);
						},
						error: function(oError) {
							// Error
							reject(err);
						},
					});
				});
			},

			buscaOv: function(sCodigo, sNome) {
				return new Promise(function(resolve, reject) {
					var sUrl = "/sap/opu/odata/SAP/Z_ASSISTENTE_VENDAS_SRV/";
					var oModel = new sap.ui.model.odata.v2.ODataModel(sUrl);
					oModel.setUseBatch(false);
					var filters = [];
					var filter = "";

					if (sCodigo !== "") {
						filter = new sap.ui.model.Filter(
							"Documento",
							sap.ui.model.FilterOperator.Contains,
							sCodigo
						);
						filters.push(filter);
					}

					filter = new sap.ui.model.Filter(
						"TipoDoc",
						sap.ui.model.FilterOperator.EQ,
						"C"
					);
					filters.push(filter);

					oModel.read("/ZVND_CDS_C_DADOS_ORDEM", {
						filters: filters,
						success: function(oData) {
							var dataToReturn = [];
							var dados;

							oData.results.map(function(resultItem) {
								dados = {
									cod: resultItem.Documento,
									desc: resultItem.CriadoPor,
								};
								dataToReturn.push(dados);
							});

							resolve(dataToReturn);
						},
						error: function(err) {
							reject(err);
						},
					});
				});
			},

			buscaCotacao: function(sCodigo, sNome) {
				return new Promise(function(resolve, reject) {
					var sUrl = "/sap/opu/odata/SAP/Z_ASSISTENTE_VENDAS_SRV/";
					var oModel = new sap.ui.model.odata.v2.ODataModel(sUrl);
					oModel.setUseBatch(false);
					var filters = [];
					var filter = "";

					if (sCodigo !== "") {
						filter = new sap.ui.model.Filter(
							"Documento",
							sap.ui.model.FilterOperator.Contains,
							sCodigo
						);
						filters.push(filter);
					}

					filter = new sap.ui.model.Filter(
						"TipoDoc",
						sap.ui.model.FilterOperator.EQ,
						"B"
					);
					filters.push(filter);

					oModel.read("/ZVND_CDS_C_DADOS_COTACAO", {
						filters: filters,
						success: function(oData) {
							var dataToReturn = [];
							var dados;

							oData.results.map(function(resultItem) {
								dados = {
									cod: resultItem.Documento,
									desc: resultItem.CriadoPor,
								};
								dataToReturn.push(dados);
							});

							resolve(dataToReturn);
						},
						error: function(err) {
							reject(err);
						},
					});
				});
			},

			buscaMotivoRecusa: function(path) {
				return new Promise(function(resolve, reject) {
					var sUrl = "/sap/opu/odata/SAP/Z_ASSISTENTE_VENDAS_SRV/";
					var oModel = new sap.ui.model.odata.v2.ODataModel(sUrl);
					oModel.setUseBatch(false);

					oModel.read("/ZVND_CDS_C_MOTIVO_RECUSA", {
						success: function(oData) {
							var dataToReturn = [];
							var dados;

							oData.results.map(function(resultItem) {
								dados = {
									cod: resultItem.Motivo,
									desc: resultItem.DescricaoMotivo,
								};
								dataToReturn.push(dados);
							});

							dataToReturn.sort(function(a, b) {
								return +(a.cod > b.cod) || +(a.cod === b.cod) - 1;
							});

							resolve(dataToReturn);
						},
						error: function(err) {
							reject(err);
						},
					});
				});
			},

			buscaDadosEmissor: function(
				idEmissor,
				iOrgVendas,
				iCanalDist,
				idSetor
			) {
				return new Promise(function(resolve, reject) {
					var filters = [];
					var filter = "";
					filter = new sap.ui.model.Filter(
						"Emissor",
						sap.ui.model.FilterOperator.EQ,
						idEmissor
					);
					filters.push(filter);

					filter = new sap.ui.model.Filter(
						"OrgVendas",
						sap.ui.model.FilterOperator.EQ,
						iOrgVendas
					);
					filters.push(filter);

					filter = new sap.ui.model.Filter(
						"Canal",
						sap.ui.model.FilterOperator.EQ,
						iCanalDist
					);
					filters.push(filter);

					filter = new sap.ui.model.Filter(
						"Setor",
						sap.ui.model.FilterOperator.EQ,
						idSetor
					);
					filters.push(filter);

					var sUrl = "/sap/opu/odata/SAP/Z_ASSISTENTE_VENDAS_SRV/";
					var oModel = new sap.ui.model.odata.v2.ODataModel(sUrl);
					oModel.setUseBatch(false);

					oModel.read("/ZVND_CDS_C_DADOS_EMISSOR", {
						filters: filters,
						success: function(oData) {
							var dataToReturn = [];

							oData.results.map(function(resultItem) {
								dataToReturn.push(resultItem);
							});

							resolve(dataToReturn);
						},
						error: function(err) {
							reject(err);
						},
					});
				});
			},

			preenchimentoAutomaticoOV: function(sOV) {
				return new Promise(function(resolve, reject) {
					var sUrl = "/sap/opu/odata/SAP/Z_ASSISTENTE_VENDAS_SRV/";
					var oModel = new sap.ui.model.odata.v2.ODataModel(sUrl);
					oModel.setUseBatch(false);

					var filters = [];
					var filter = "";
					filter = new sap.ui.model.Filter(
						"Ordem",
						sap.ui.model.FilterOperator.EQ,
						sOV
					);
					filters.push(filter);

					oModel.read("/ZVND_CDS_C_PREENC_AUTO_OV", {
						filters: filters,
						success: function(oData) {
							var dataToReturn = [];
							var dados;

							oData.results.map(function(resultItem) {
								dataToReturn.push(resultItem);
							});

							resolve(dataToReturn);
						},
						error: function(err) {
							reject(err);
						},
					});
				});
			},

			buscaFluxoDocumento: function(sOV) {
				return new Promise(function(resolve, reject) {
					var sUrl = "/sap/opu/odata/SAP/Z_ASSISTENTE_VENDAS_SRV/";
					var oModel = new sap.ui.model.odata.v2.ODataModel(sUrl);
					oModel.setUseBatch(false);

					var filters = [];
					var filter = "";
					filter = new sap.ui.model.Filter(
						"Documento",
						sap.ui.model.FilterOperator.EQ,
						sOV
					);
					filters.push(filter);

					oModel.read("/ZVND_CDS_C_FLUXO_DOC", {
						filters: filters,
						success: function(oData) {
							var dataToReturn = [];
							var dados;

							oData.results.map(function(resultItem) {
								dataToReturn.push(resultItem);
							});

							resolve(dataToReturn);
						},
						error: function(err) {
							reject(err);
						},
					});
				});
			},

			ListaProdutos: function(
				iMaterial,
				iGrupo,
				iCanalDist,
				iCentro
			) {
				return new Promise(function(resolve, reject) {
					var filters = [];
					var filter = "";

					if (iMaterial!==""){
						filter = new sap.ui.model.Filter(
							"Material",
							sap.ui.model.FilterOperator.EQ,
							iMaterial
						);
						filters.push(filter);
					}

					if (iGrupo!==""){
						filter = new sap.ui.model.Filter(
							"GrupoMerc",
							sap.ui.model.FilterOperator.EQ,
							iGrupo
						);
						filters.push(filter);
					}

					if (iCanalDist!==""){
						filter = new sap.ui.model.Filter(
							"Canal",
							sap.ui.model.FilterOperator.EQ,
							iCanalDist
						);
						filters.push(filter);
					}

					if (iCentro!==""){
						filter = new sap.ui.model.Filter(
							"Centro",
							sap.ui.model.FilterOperator.EQ,
							iCentro
						);
						filters.push(filter);
					}		

					var sUrl = "/sap/opu/odata/SAP/Z_ASSISTENTE_VENDAS_SRV/";
					var oModel = new sap.ui.model.odata.v2.ODataModel(sUrl);
					oModel.setUseBatch(false);

					oModel.read("/ListaProdutosSet", {
						filters: filters,
						success: function(oData) {
							var dataToReturn = [];
							var dados;

							oData.results.map(function(resultItem) {
								dataToReturn.push(resultItem);
							});

							resolve(dataToReturn);
						},
						error: function(err) {
							reject(err);
						},
					});
				});
			},

			buscaGrupo: function(path) {
				return new Promise(function(resolve, reject) {
					var sUrl = "/sap/opu/odata/SAP/Z_ASSISTENTE_VENDAS_SRV/";
					var oModel = new sap.ui.model.odata.v2.ODataModel(sUrl);
					oModel.setUseBatch(false);

					oModel.read("/ZVND_CDS_C_GRUPOM", {
						success: function(oData) {
							var dataToReturn = [];
							var dados;

							oData.results.map(function(resultItem) {
									dados = {
										cod: resultItem.Codigo,
										desc: resultItem.Descricao,
									};
									dataToReturn.push(dados);
							});

							dataToReturn.sort(function(a, b) {
								return +(a.cod > b.cod) || +(a.cod === b.cod) - 1;
							});

							resolve(dataToReturn);
						},
						error: function(err) {
							reject(err);
						},
					});
				});
			},

			buscaMaterialConfiguravel: function(sMaterial) {
				return new Promise(function(resolve, reject) {
					var sUrl = "/sap/opu/odata/SAP/Z_ASSISTENTE_VENDAS_SRV/";
					var oModel = new sap.ui.model.odata.v2.ODataModel(sUrl);
					oModel.setUseBatch(false);

					var filters = [];
					var filter = "";
					filter = new sap.ui.model.Filter(
						"Material",
						sap.ui.model.FilterOperator.EQ,
						sMaterial
					);
					filters.push(filter);

					oModel.read("/BuscaMaterialConfiguravelSet", {
						filters: filters,
						success: function(oData) {
							var dataToReturn = [];
							var dados;

							oData.results.map(function(resultItem) {
								dataToReturn.push(resultItem);
							});

							resolve(dataToReturn);
						},
						error: function(err) {
							reject(err);
						},
					});
				});
			},

			verificaEstoqueMatConfig:  function(sMaterial,sAtnam,sQtd,sCentro,sCanal,sOrgVendas) {
				return new Promise(function(resolve, reject) {

					var sUrl = "/sap/opu/odata/SAP/Z_ASSISTENTE_VENDAS_SRV/";
					var oModel = new sap.ui.model.odata.v2.ODataModel(sUrl);
					oModel.setUseBatch(false);

					var filters = [];
					var filter = "";
					
					filter = new sap.ui.model.Filter(
						"Matnr",
						sap.ui.model.FilterOperator.EQ,
						sMaterial
					);
					filters.push(filter);

					filter = new sap.ui.model.Filter(
						"Atnam",
						sap.ui.model.FilterOperator.EQ,
						sAtnam
					);
					filters.push(filter);

					filter = new sap.ui.model.Filter(
						"Qtd",
						sap.ui.model.FilterOperator.EQ,
						sQtd
					);
					filters.push(filter);

					filter = new sap.ui.model.Filter(
						"Centro",
						sap.ui.model.FilterOperator.EQ,
						sCentro
					);
					filters.push(filter);

					filter = new sap.ui.model.Filter(
						"Canal",
						sap.ui.model.FilterOperator.EQ,
						sCanal
					);
					filters.push(filter);

					filter = new sap.ui.model.Filter(
						"OrgVendas",
						sap.ui.model.FilterOperator.EQ,
						sOrgVendas
					);
					filters.push(filter);

					oModel.read("/VerificaEstoqueConfigSet", {
						filters: filters,
						success: function(oData) {
							var dataToReturn = [];
							var dados;

							oData.results.map(function(resultItem) {
								dataToReturn.push(resultItem);
							});

							resolve(dataToReturn);
						},
						error: function(err) {
							reject(err);
						},
					});
				});
			},

			buscaCaracteristicas: function(sAtinn) {
				return new Promise(function(resolve, reject) {
					var sUrl = "/sap/opu/odata/SAP/Z_ASSISTENTE_VENDAS_SRV/";
					var oModel = new sap.ui.model.odata.v2.ODataModel(sUrl);
					oModel.setUseBatch(false);

					var filters = [];
					var filter = "";
					filter = new sap.ui.model.Filter(
						"Atinn",
						sap.ui.model.FilterOperator.EQ,
						sAtinn
					);
					filters.push(filter);

					oModel.read("/ZVND_CDS_C_CARACT", {
						filters: filters,
						success: function(oData) {
							var dataToReturn = [];
							var dados;
							var cod = "";
							var desc = "";

							oData.results.map(function(resultItem) {

								if (resultItem.Cod===""){
									cod = resultItem.Cod2;
									desc = "";
								}else{
									cod = resultItem.Cod;
									desc = resultItem.Descricao;
								}

								dados = {
									cod: cod,
									desc: desc,
								};
								dataToReturn.push(dados);
							});

							dataToReturn.sort(function(a, b) {
								return +(a.cod > b.cod) || +(a.cod === b.cod) - 1;
							});

							resolve(dataToReturn);
						},
						error: function(err) {
							reject(err);
						},
					});
				});
			},

			verificaVendedor: function(sAtinn) {
				return new Promise(function(resolve, reject) {
					var sUrl = "/sap/opu/odata/SAP/Z_ASSISTENTE_VENDAS_SRV/";
					var oModel = new sap.ui.model.odata.v2.ODataModel(sUrl);
					oModel.setUseBatch(false);

					oModel.read("/VerificaVendedorSet", {
						success: function(oData) {
							var dataToReturn = [];
							var dados;
							oData.results.map(function(resultItem) {
								dataToReturn.push(resultItem);
							});
							resolve(dataToReturn);
						},
						error: function(err) {
							reject(err);
						},
					});
				});
			},

			verificaData: function(sAtinn) {
				return new Promise(function(resolve, reject) {
					var sUrl = "/sap/opu/odata/SAP/Z_ASSISTENTE_VENDAS_SRV/";
					var oModel = new sap.ui.model.odata.v2.ODataModel(sUrl);
					oModel.setUseBatch(false);

					oModel.read("/ZVND_CDS_CE_VERIFICA_DATA", {
						success: function(oData) {
							var dataToReturn = [];
							var dados;
							oData.results.map(function(resultItem) {
								dataToReturn.push(resultItem);
							});
							resolve(dataToReturn);
						},
						error: function(err) {
							reject(err);
						},
					});
				});
			},

		};
	}
);