sap.ui.define(
  [
    "com/assistente/controller/BaseController", //"sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/IconPool",
    "sap/m/Dialog",
    "sap/m/Button",
    "sap/m/library",
    "sap/m/Table",
    "sap/m/StandardListItem",
    "sap/m/Text",
    "sap/m/library",
    "sap/m/ColumnListItem",
    "sap/ui/core/Fragment",
    "sap/m/Label",
    "sap/m/List",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageToast",
    "com/assistente/controller/Results",
    "sap/ui/layout/HorizontalLayout",
    "sap/ui/layout/VerticalLayout",
    "sap/m/TextArea",
    "sap/m/Input",
    "sap/m/MessageBox",
    "com/assistente/model/formatter",
    "sap/ui/core/Core",
    "sap/ui/core/library",
    "sap/ui/unified/library",
    "sap/ui/core/routing/History",
  ],
  function (
    Controller,
    JSONModel,
    IconPool,
    Dialog,
    Button,
    mobileLibrary,
    Table,
    StandardListItem,
    Text,
    Library,
    ColumnListItem,
    Fragment,
    Label,
    List,
    Filter,
    FilterOperator,
    MessageToast,
    Results,
    HorizontalLayout,
    VerticalLayout,
    TextArea,
    Input,
    MessageBox,
    formatter,
    Core,
    CoreLibrary,
    UnifiedLibrary,
    History
  ) {
    "use strict";

    // shortcut for sap.m.ButtonType
    //var ButtonType = mobileLibrary.ButtonType;
    // shortcut for sap.m.DialogType
    //var DialogType = mobileLibrary.DialogType;
    //var gThis;
    var CalendarDayType = UnifiedLibrary.CalendarDayType,
      ValueState = CoreLibrary.ValueState,
      valueLink = "",
      stateView = "",
      gDocumento = "",
      gCentro = "",
      gPath = "",
      gRef = "",
      gCalculate = "",
      gCNPJ = "";

    return Controller.extend("com.assistente.controller.Ordem", {
      formatter: formatter,

      onInit: function () {
        this.getView().setBusy(true);
        var nameUser = sap.ui.getCore().getModel("usuarionome_loja");
        var user = sap.ui.getCore().getModel("usuario_loja");
        this.byId("idUsuario").setText(user);
        this.byId("nomeUsuario").setText(nameUser);

        var sLoja = sap.ui.getCore().getModel("nomeLoja");
        let nomeLoja = this.byId("nomeLoja");
        if (typeof sLoja != undefined) {
          nomeLoja.setText(sLoja);
        }

        var oData = {
          Itens: [
            {
              Item: "010",
              Material: "",
              Descricao: "",
              Centro: "",
              Estoque: "",
              Qtd: "",
              UM: "",
              Preco: "",
              Preco2: "",
              DescPercentual: "",
              Desconto: "",
              ICMS: "",
              ST: "",
              IPI: "",
              Comissao: "",
              ValorItem: "",
              CurrencyCode: "BRL",
              DataConfirmada: "",
              DataDesejada: "",
              MotivoRecusaItem: "",
              Perda: "",
              PlanoCorte: "",
              Caracteristica: "",
              CaracteristicaValor: "",
            },
          ],
        };

        var oModel = new JSONModel(oData);
        this.getView().setModel(oModel, "ModelItens");

        //Iniciar a model
        var oData1 = {};
        var oModel2 = new JSONModel();
        var data1 = [];
        oData1.Itens = data1;
        oModel2.setData(oData1);
        this.getView().setModel(oModel2, "textos");
        this.getView().setModel(oModel2, "textosOld");
        this.getView().setModel(oModel2, "dadosAdicionais");

        this.getOwnerComponent()
          .getRouter()
          .getRoute("ordem")
          .attachPatternMatched(this._onMasterMatched, this);
      },

      onPressMenuButton: function () {
        sap.ui
          .controller("com.assistente.controller.Inicio")
          .onPressMenuButton();
      },

      preenchimentoAutomatico: function () {
        var this_ = this;

        Results.preenchimentoAutomatico().then(
          function (data) {
            if (data.length > 0) {
              var dateI = new Date();
              dateI.setDate(dateI.getDate() + 1);

              this_.getView().byId("idOrgVend").setValue(data[0].OrgVendas);
              this_.getView().byId("idCanal").setValue(data[0].Canal) +
                "-Produtos";
              this_.getView().byId("idSetor").setValue("00");
              this_
                .getView()
                .byId("idValidoAte")
                .setValue(dateI.toLocaleDateString());
              this_.getView().byId("idEscritorio").setValue(data[0].Escritorio);
              this_.buscaModel(this_.getView().byId("idOrgVend"), "idOrgVend");
              this_.buscaModel(this_.getView().byId("idCanal"), "idCanal");
              this_.buscaModel(this_.getView().byId("idSetor"), "idSetor");
              this_.buscaModel(
                this_.getView().byId("idEscritorio"),
                "idEscritorio"
              );
              this_.getView().getModel("ModelItens").getData().Itens[0].Centro =
                data[0].Centro;
              this_.getView().getModel("ModelItens").refresh(true);
              gCentro = data[0].Centro;
            }

            Results.verificaData().then(
              function (data) {
                if (data.length > 0) {
                 this_.getView().byId("idDataPedido").setValue(data[0].DataFim);
                }
              },
             function (error) { });

            this_.getView().setBusy(false);
          },
          function (error) {
            this_.getView().setBusy(false);
          }
        );
      },

      _onMasterMatched: function (oEvent) {
        gRef = "";
        gCalculate = "";
        this.getView().byId("nomeLoja").setVisible(true);

        if (oEvent.getParameters().name === "ordem") {
          this.getView().setBusy(true);
          this.getMatchodes();

          this.byId("page").scrollTo(0);
          this.onLimpaTela();
          this.setaEditable(true, this);
          this.getView().byId("idOK").setEnabled(false);

          var oArgument = oEvent.getParameters().arguments;
          var vOrdem = oArgument.Id.split(";");

          if (vOrdem[0] !== "0") {
            gDocumento = vOrdem[0];
            this.getView()
              .byId("idDadosCotacao")
              .setText("Dados da ordem " + gDocumento);
            //this.getView().byId("idBloqueio").setVisible(true);
            //this.getView().byId("idBloqueioElement").setVisible(true);
            this.getView().byId("idModificar").setVisible(true);
            this.getView().byId("idModificar").setEnabled(true);
            this.getView().byId("idPagto").setVisible(true);
            stateView = "VISUALIZA";
            this.gDocumento = gDocumento;

            if (vOrdem.length > 1) {
              gRef = vOrdem[0];

              stateView = "CRIA";
              this.getView().byId("idDadosCotacao").setText("Dados da ordem");
              //this.getView().byId("idBloqueio").setVisible(false);
              //this.getView().byId("idBloqueioElement").setVisible(false);
              this.getView().byId("idModificar").setVisible(false);
              this.getView().byId("idPagto").setVisible(false);

              this.getView().setBusy(true);
              this.buscaDadosCotacao(vOrdem[0], "B");
            } else {
              this.getView().setBusy(true);
              this.buscaDadosCotacao(vOrdem[0], "C");
            }
          } else {
            stateView = "CRIA";
            this.getView().byId("idDadosCotacao").setText("Dados da ordem");
            //this.getView().byId("idBloqueio").setVisible(false);
            //this.getView().byId("idBloqueioElement").setVisible(false);
            this.getView().byId("idModificar").setVisible(false);
            this.getView().byId("idPagto").setVisible(false);
          }

          if (stateView === "CRIA") {
            this.preenchimentoAutomatico();
          }
        }
      },

      buscaTipoOVPreenchimentoAutomatico: function (sOV) {
        var this_ = this;
        Results.preenchimentoAutomaticoOV(sOV).then(
          function (data) {
            if (data.length > 0) {
              this_
                .getView()
                .byId("idTpCotacao")
                .setValue(data[0].TipoOV + "-" + data[0].DescTpCotacao);
            }
          },
          function (error) {
            this_.getView().setBusy(false);
          }
        );
      },

      getMatchodes: function () {
        var this_ = this;
        var count = 0;

        this.getView().setBusy(true);
        Results.buscaTipoOrdem().then(
          function (data) {
            var oData = {};
            var oModelSearch = new JSONModel();
            oData.Itens = data;
            oModelSearch.setData(oData);
            this_.getView().setModel(oModelSearch, "idTpCotacao");
            count = count + 1;
          },
          function (error) {
            count = count + 1;
          }
        );

        Results.buscaOrgVendas().then(
          function (data) {
            var oData = {};
            var oModelSearch = new JSONModel();
            oData.Itens = data;
            oModelSearch.setData(oData);
            this_.getView().setModel(oModelSearch, "idOrgVend");
            count = count + 1;
          },
          function (error) {
            count = count + 1;
          }
        );

        Results.buscaCanal().then(
          function (data) {
            var oData = {};
            var oModelSearch = new JSONModel();
            oData.Itens = data;
            oModelSearch.setData(oData);
            this_.getView().setModel(oModelSearch, "idCanal");
            count = count + 1;
          },
          function (error) {
            count = count + 1;
          }
        );

        Results.buscaSetor().then(
          function (data) {
            var oData = {};
            var oModelSearch = new JSONModel();
            oData.Itens = data;
            oModelSearch.setData(oData);
            this_.getView().setModel(oModelSearch, "idSetor");
            count = count + 1;
          },
          function (error) {
            count = count + 1;
          }
        );

        Results.buscaEscritorio().then(
          function (data) {
            var oData = {};
            var oModelSearch = new JSONModel();
            oData.Itens = data;
            oModelSearch.setData(oData);
            this_.getView().setModel(oModelSearch, "idEscritorio");
            count = count + 1;
          },
          function (error) {
            count = count + 1;
          }
        );
        /*		
				Results.buscaEmissor()
					.then(function (data) {
						var oData = {};
						var oModelSearch = new JSONModel();
						oData.Itens = data;
						oModelSearch.setData(oData);
						this_.getView().setModel(oModelSearch, "idEmissor");
						count = count + 1;
	
					},
						function (error) { count = count + 1; });
	
				Results.buscaRecebedor()
					.then(function (data) {
						var oData = {};
						var oModelSearch = new JSONModel();
						oData.Itens = data;
						oModelSearch.setData(oData);
						this_.getView().setModel(oModelSearch, "idRecebedor");
						count = count + 1;
	
					},
						function (error) { count = count + 1; });
					*/
        Results.buscaFormaPag().then(
          function (data) {
            var oData = {};
            var oModelSearch = new JSONModel();
            oData.Itens = data;
            oModelSearch.setData(oData);
            this_.getView().setModel(oModelSearch, "idFormaPag");
            count = count + 1;
          },
          function (error) {
            count = count + 1;
          }
        );

        Results.buscaCondPag().then(
          function (data) {
            var oData = {};
            var oModelSearch = new JSONModel();
            oData.Itens = data;
            oModelSearch.setData(oData);
            this_.getView().setModel(oModelSearch, "idCondPag");
            count = count + 1;
          },
          function (error) {
            count = count + 1;
          }
        );

        Results.buscaUitilizacao().then(
          function (data) {
            var oData = {};
            var oModelSearch = new JSONModel();
            oData.Itens = data;
            oModelSearch.setData(oData);
            this_.getView().setModel(oModelSearch, "idUtilizacao");
            count = count + 1;
          },
          function (error) {
            count = count + 1;
          }
        );

        Results.buscaMotivo().then(
          function (data) {
            var oData = {};
            var oModelSearch = new JSONModel();
            oData.Itens = data;
            oModelSearch.setData(oData);
            this_.getView().setModel(oModelSearch, "idMotivo");
            count = count + 1;
          },
          function (error) {
            count = count + 1;
          }
        );
        /*
						Results.buscaVendedor()
							.then(function (data) {
								var oData = {};
								var oModelSearch = new JSONModel();
								oData.Itens = data;
								oModelSearch.setData(oData);
								this_.getView().setModel(oModelSearch, "idVendedor");
								count = count + 1;
			
							},
								function (error) { count = count + 1; });
			
						Results.buscaMaterial()
							.then(function (data) {
								var oData = {};
								var oModelSearch = new JSONModel();
								oData.Itens = data;
								oModelSearch.setData(oData);
								this_.getView().setModel(oModelSearch, "idMaterial");
								count = count + 1;
			
							},
								function (error) { count = count + 1; });
			*/
        Results.buscaIncoterms().then(
          function (data) {
            var oData = {};
            var oModelSearch = new JSONModel();
            oData.Itens = data;
            oModelSearch.setData(oData);
            this_.getView().setModel(oModelSearch, "idIncoterms1");
            count = count + 1;
          },
          function (error) {
            count = count + 1;
          }
        );

        Results.buscaLocalAlter().then(
          function (data) {
            var oData = {};
            var oModelSearch = new JSONModel();
            oData.Itens = data;
            oModelSearch.setData(oData);
            this_.getView().setModel(oModelSearch, "idLocal");
            count = count + 1;
          },
          function (error) {
            count = count + 1;
          }
        );

        Results.buscaCentro().then(
          function (data) {
            var oData = {};
            var oModelSearch = new JSONModel();
            oData.Itens = data;
            oModelSearch.setData(oData);
            this_.getView().setModel(oModelSearch, "idCentro");
            count = count + 1;
          },
          function (error) {
            count = count + 1;
          }
        );

        Results.buscaLimiteCarga().then(
          function (data) {
            var oData = {};
            var oModelSearch = new JSONModel();
            oData.Itens = data;
            oModelSearch.setData(oData);
            this_.getView().setModel(oModelSearch, "idLimiteCarga");
            count = count + 1;
          },
          function (error) {
            count = count + 1;
          }
        );

        Results.buscaLimiteVeiculo().then(
          function (data) {
            var oData = {};
            var oModelSearch = new JSONModel();
            oData.Itens = data;
            oModelSearch.setData(oData);
            this_.getView().setModel(oModelSearch, "idLimiteVeiculo");
            count = count + 1;
          },
          function (error) {
            count = count + 1;
          }
        );

        Results.buscaSegmento().then(
          function (data) {
            var oData = {};
            var oModelSearch = new JSONModel();
            oData.Itens = data;
            oModelSearch.setData(oData);
            this_.getView().setModel(oModelSearch, "idSegmento");
            count = count + 1;
          },
          function (error) {
            count = count + 1;
          }
        );

        Results.buscaRestricao1().then(
          function (data) {
            var oData = {};
            var oModelSearch = new JSONModel();
            oData.Itens = data;
            oModelSearch.setData(oData);
            this_.getView().setModel(oModelSearch, "idRestricao1");
            count = count + 1;
          },
          function (error) {
            count = count + 1;
          }
        );

        Results.buscaRestricao2().then(
          function (data) {
            var oData = {};
            var oModelSearch = new JSONModel();
            oData.Itens = data;
            oModelSearch.setData(oData);
            this_.getView().setModel(oModelSearch, "idRestricao2");
            count = count + 1;
          },
          function (error) {
            count = count + 1;
          }
        );

        Results.buscaRestricao3().then(
          function (data) {
            var oData = {};
            var oModelSearch = new JSONModel();
            oData.Itens = data;
            oModelSearch.setData(oData);
            this_.getView().setModel(oModelSearch, "idRestricao3");
            count = count + 1;
          },
          function (error) {
            count = count + 1;
          }
        );

        Results.buscaRestricao4().then(
          function (data) {
            var oData = {};
            var oModelSearch = new JSONModel();
            oData.Itens = data;
            oModelSearch.setData(oData);
            this_.getView().setModel(oModelSearch, "idRestricao4");
            count = count + 1;
          },
          function (error) {
            count = count + 1;
          }
        );

        Results.buscaRestricao5().then(
          function (data) {
            var oData = {};
            var oModelSearch = new JSONModel();
            oData.Itens = data;
            oModelSearch.setData(oData);
            this_.getView().setModel(oModelSearch, "idRestricao5");
            count = count + 1;
          },
          function (error) {
            count = count + 1;
          }
        );

        Results.buscaCertificado().then(
          function (data) {
            var oData = {};
            var oModelSearch = new JSONModel();
            oData.Itens = data;
            oModelSearch.setData(oData);
            this_.getView().setModel(oModelSearch, "idCertificado");
            count = count + 1;
          },
          function (error) {
            count = count + 1;
          }
        );

        Results.buscaRecebimento().then(
          function (data) {
            var oData = {};
            var oModelSearch = new JSONModel();
            oData.Itens = data;
            oModelSearch.setData(oData);
            this_.getView().setModel(oModelSearch, "idRecebimento");
            count = count + 1;
          },
          function (error) {
            count = count + 1;
          }
        );

        Results.buscaIndicacaoComercial().then(
          function (data) {
            var oData = {};
            var oModelSearch = new JSONModel();
            oData.Itens = data;
            oModelSearch.setData(oData);
            this_.getView().setModel(oModelSearch, "idIndicaoComercial");
            count = count + 1;
          },
          function (error) {
            count = count + 1;
          }
        );

        Results.buscaBloqueio().then(
          function (data) {
            var oData = {};
            var oModelSearch = new JSONModel();
            oData.Itens = data;
            oModelSearch.setData(oData);
            this_.getView().setModel(oModelSearch, "idBloqueio");
            count = count + 1;
          },
          function (error) {
            count = count + 1;
          }
        );

        Results.buscaMotivoRecusa().then(
          function (data) {
            var oData = {};
            var oModelSearch = new JSONModel();
            oData.Itens = data;
            oModelSearch.setData(oData);
            this_.getView().setModel(oModelSearch, "idMotivoRecusaItem");
            count = count + 1;
          },
          function (error) {
            count = count + 1;
          }
        );

        //Wait para fazer o preenchimento automatico
        for (var i = 2; i > 0; i++) {
          if (i > 1100000 || count === 24) {
            this_.getView().setBusy(false);
            break;
          }
        }
      },

      converteData: function (date) {
        var aDate = [];
        var rDate = "";
        var sDia = "00";
        var sMes = "00";
        var sAno = "0000";

        if (date !== undefined && date !== "") {
          var result = date.includes("/", 0);
          if (result) {
            aDate = date.split("/");
          } else {
            aDate = date.split(".");
          }

          sDia = aDate[0];
          sMes = aDate[1];
          sAno = aDate[2];

          if (sDia.length === 1) {
            sDia = "0" + sDia;
          }

          if (sMes.length === 1) {
            sMes = "0" + sMes;
          }

          if (sAno.length === 2) {
            sAno = "20" + sAno;
          }

          var rDate = sAno + sMes + sDia;
        }

        return rDate;
      },

      buscaCodigo: function (field) {
        var value = [];
        if (field !== undefined && field !== "") {
          value = field.split("-");
          field = value[0];
        }
        return field;
      },

      onValidaQuantidade: function (oEvent) {
        this.limpaItens();
        //var value = oEvent.oSource.setValue("");
      },

      onValidaCampos: function (oEvent) {
        var oView = this.getView(),
          aInputs = [
            oView.byId("idTpCotacao"),
            oView.byId("idOrgVend"),
            oView.byId("idCanal"),
            oView.byId("idEmissor"),
            oView.byId("idSetor"),
          ],
          bValidationError = false;

        // Validation does not happen during data binding as this is only triggered by user actions.
        aInputs.forEach(function (oInput) {
          bValidationError = this._validateInput(oInput) || bValidationError;
        }, this);

        if (bValidationError) {
          MessageBox.alert("Favor preencher os dados");
        }

        return bValidationError;
      },

      _validateInput: function (oInput) {
        var sValueState = "None";
        var bValidationError = false;
        var value = oInput.getValue();

        try {
          if (value === "") {
            sValueState = "Error";
            bValidationError = true;
          } else {
            bValidationError = false;
          }
        } catch (oException) {
          sValueState = "Error";
          bValidationError = true;
        }

        oInput.setValueState(sValueState);

        return bValidationError;
      },

      _validateInputItens: function (oInput) {
        var sValueState = "None";
        var bValidationError = false;
        var value = oInput.getValue();

        try {
          if (value === "") {
            sValueState = "Error";
            bValidationError = true;
          } else {
            bValidationError = false;
          }
        } catch (oException) {
          sValueState = "Error";
          bValidationError = true;
        }

        oInput.setValueState(sValueState);

        return bValidationError;
      },

      handleAccept: function (oEvent) {
        var oDataOrig = this.getView().getModel("ModelItens").getData();
        var count = oDataOrig.Itens.length - 1; //Buscar o Ultimo registro
        var item = "000";

        if (oDataOrig.Itens.length === 0) {
          item = "010";
        } else {
          item = Number(oDataOrig.Itens[count].Item) + 10;
        }

        if (item.toString().length == 2) {
          item = "0" + item;
        }

        if (stateView==="MODIFICA"){
          gCentro = oDataOrig.Itens[count].Centro;
        }

        var oData = {
          Item: item,
          Material: "",
              Descricao: "",
              Centro: gCentro,
              Estoque: "",
              Qtd: "",
              UM: "",
              Preco: "",
              DescPercentual: "",
              Desconto: "",
              ICMS: "",
              ST: "",
              IPI: "",
              Comissao: "",
              ValorItem: "",
              CurrencyCode: "BRL",
              DataConfirmada: "",
              DataDesejada: "",
              MotivoRecusaItem: "",
              Perda: "",
              PlanoCorte: "",
              Caracteristica: "",
              CaracteristicaValor: "",
              Preco2: "",
        };

        var oDataOrig = this.getView().getModel("ModelItens").getData();
        oDataOrig.Itens.push(oData);
        var oModel = new JSONModel(oDataOrig);
        this.getView().setModel(oModel, "ModelItens");
        this.getView().getModel("ModelItens").refresh(true);
      },

      handleReject: function (oEvent) {
        var valoresSelecionados =
          this.byId("idProductsTable").getSelectedContexts();
        var sPatch = valoresSelecionados[0].sPath;
        var oSource = oEvent.getSource();
        var oModelOrig = oSource.getModel("ModelItens");
        var oRow = oModelOrig.getProperty(sPatch);
        var oDataOrig = this.getView().getModel("ModelItens").getData();
        var this_ = this;
        var oData = {};
        var dados = [];
        var vFlag = "";
        var item = "000";

        if (oDataOrig.Itens.length === 1) {
          MessageBox.alert("Não é permitido eliminar o item");
        } else {
          for (var i = 0; i < oDataOrig.Itens.length; i++) {
            vFlag = "";
            for (var o = 0; o < valoresSelecionados.length; o++) {
              sPatch = valoresSelecionados[o].sPath;
              oRow = oModelOrig.getProperty(sPatch);

              if (oDataOrig.Itens[i].Item === oRow.Item) {
                //oDataOrig.Itens.splice(i, 1);
                vFlag = "X";
                break;
              }
            }

            if (vFlag === "") {
              if (stateView!=="MODIFICA"){
                item = Number(item) + 10;
                if (item.toString().length == 2) {
                  item = "0" + item;
                }
                oDataOrig.Itens[i].Item = item;
              }
              dados.push(oDataOrig.Itens[i]);
            }
          }

          MessageBox.confirm("Deseja realmente eliminar os itens ?", {
            title: "Informação",
            initialFocus: sap.m.MessageBox.Action.CANCEL,
            onClose: function (sButton) {
              if (sButton === MessageBox.Action.OK) {
                oData.Itens = dados;
                var oModel = new JSONModel(oData);
                this_.getView().setModel(oModel, "ModelItens");
                sap.ui.getCore().setModel("ModelSearchs", oModel);

                this_.getView().getModel("ModelItens").refresh(true);
              } else {
              }
            },
          });
        }
      },

      onSelectDialogPress: function (oEvent) {
        var sInputValue, sSearchFiled;
        var validate = false;

        var result1 = oEvent.getSource().getId().includes("idMaterial", 0);
        //Valida Campos Obrigatórios
        if (result1) {
          gPath = oEvent.getSource().getBindingContext("ModelItens").getPath();
          validate = this.onValidaCampos();
          if (validate) {
            return;
          }
        }

        result1 = oEvent.getSource().getId().includes("idLocal", 0);
        if (result1) {
          if (stateView === "CRIA") {
            validate = this.onValidaDadosAdicionais();
            if (validate) {
              this.getView().byId(oEvent.getSource().getId()).setValue();
              return;
            }
          }
        }

        var valorSplit = oEvent.getSource().getValue().split("-");
        sInputValue = valorSplit[0];

        if (this._oDialog) {
          this._oDialog.destroy();
        }

        this.inputId = oEvent.getSource().getId();
        this._oDialog = sap.ui.xmlfragment(
          "com.assistente.view.ValueHelpDialogBasic",
          this
        );

        this.getView().addDependent(this._oDialog);

        this.setModelDialog("idTpCotacao", this.inputId);
        this.setModelDialog("idOrgVend", this.inputId);
        this.setModelDialog("idCanal", this.inputId);
        this.setModelDialog("idSetor", this.inputId);
        this.setModelDialog("idEscritorio", this.inputId);
        this.setModelDialog("idEmissor", this.inputId);
        this.setModelDialog("idFormaPag", this.inputId);
        this.setModelDialog("idUtilizacao", this.inputId);
        this.setModelDialog("idRecebedor", this.inputId);
        this.setModelDialog("idCondPag", this.inputId);
        this.setModelDialog("idMotivo", this.inputId);
        this.setModelDialog("idIncoterms1", this.inputId);
        this.setModelDialog("idLocal", this.inputId);
        this.setModelDialog("idMaterial", this.inputId);
        this.setModelDialog("idUm", this.inputId);
        this.setModelDialog("idCentro", this.inputId);
        this.setModelDialog("idVendedor", this.inputId);
        this.setModelDialog("idIndicaoComercial", this.inputId);
        this.setModelDialog("idBloqueio", this.inputId);
        this.setModelDialog("idFreteValor", this.inputId);
        this.setModelDialog("idMotivoRecusaItem", this.inputId);

        //Novos campos - Dados Adicionais do CLiente
        this.setModelDialog("idLimiteCarga", this.inputId);
        this.setModelDialog("idLimiteVeiculo", this.inputId);
        this.setModelDialog("idSegmento", this.inputId);
        this.setModelDialog("idRestricao1", this.inputId);
        this.setModelDialog("idRestricao2", this.inputId);
        this.setModelDialog("idRestricao3", this.inputId);
        this.setModelDialog("idRestricao4", this.inputId);
        this.setModelDialog("idRestricao5", this.inputId);
        this.setModelDialog("idCertificado", this.inputId);
        this.setModelDialog("idRecebimento", this.inputId);

        //Search Help Caracteristica
        this.setModelDialogCaracteristica(this.inputId);

        // toggle compact style
        jQuery.sap.syncStyleClass(
          "sapUiSizeCompact",
          this.getView(),
          this._oDialog
        );

        //this.getView().addDependent(this._oDialog);
        // create a filter for the bindinghandleValueHelp
        //var filters = [];
        //filters.push(new sap.ui.model.Filter(sSearchFiled, sap.ui.model.FilterOperator.Contains, sInputValue));
        //this._oDialog.getBinding("items").aFilters = filters;
        //this._oDialog.getBinding("items").filter(filters);
        // open value help dialog filtered by the input value

        //var binding = this._oDialog.getBinding("items");
        //binding.filter(filters);

        this._oDialog.open(sInputValue);
      },

      handleSearchClientes: function (oEvent) {
        var filters = [];
        var query = oEvent.getParameter("value");
        var this_ = this;
        var sCodigo = "";
        var sNome = "";
        var oData = {};
        var oModelSearch = new JSONModel();

        if ($.isNumeric(query)) {
          sCodigo = query;
        } else {
          sNome = query;
        }

        var result = this.inputId.includes("idRecebedor", 0);
        if (result) {
          if (sCodigo !== "" || sNome !== "") {
            Results.buscaRecebedor(sCodigo, sNome).then(
              function (data) {
                oData.Itens = data;
                oModelSearch.setData(oData);
                this_.getView().setModel(oModelSearch, "idRecebedor");
                this_._oDialog.setModel(oModelSearch, "ModelSearch");
              },
              function (error) {}
            );
          }
          return false;
        }

        result = this.inputId.includes("idEmissor", 0);
        if (result) {
          if (sCodigo !== "" || sNome !== "") {
            var sCPF = "";
            var sCNPJ = "";
            if (sCodigo.length === 14) {
              sCNPJ = sCodigo;
              sCodigo = "";
            } else if (sCodigo.length === 11) {
              sCPF = sCodigo;
              sCodigo = "";
            }

            Results.buscaEmissor(sCodigo, sNome, sCPF, sCNPJ).then(
              function (data) {
                oData.Itens = data;
                oModelSearch.setData(oData);
                this_.getView().setModel(oModelSearch, "idEmissor");
                this_._oDialog.setModel(oModelSearch, "ModelSearch");
              },
              function (error) {}
            );
          }
          return false;
        }

        result = this.inputId.includes("idVendedor", 0);
        if (result) {
          if (sCodigo !== "" || sNome !== "") {
            Results.buscaVendedor(sCodigo, sNome).then(
              function (data) {
                oData.Itens = data;
                oModelSearch.setData(oData);
                this_.getView().setModel(oModelSearch, "idVendedor");
                this_._oDialog.setModel(oModelSearch, "ModelSearch");
              },
              function (error) {}
            );
          }
          return false;
        }

        result = this.inputId.includes("idMaterial", 0);
        if (result) {
          if (sCodigo !== "" || sNome !== "") {
            Results.buscaMaterial(sCodigo, sNome).then(
              function (data) {
                oData.Itens = data;
                oModelSearch.setData(oData);
                this_.getView().setModel(oModelSearch, "idMaterial");
                this_._oDialog.setModel(oModelSearch, "ModelSearch");
              },
              function (error) {}
            );
          }
          return false;
        }

        if (query && query.length > 0 && query.trim() !== "") {
          var filter;

          if ($.isNumeric(query)) {
            filter = new sap.ui.model.Filter(
              "cod",
              sap.ui.model.FilterOperator.Contains,
              query
            );
          } else {
            filter = new sap.ui.model.Filter(
              "desc",
              sap.ui.model.FilterOperator.Contains,
              query
            );
          }

          filters.push(filter);
          filters = this.filtroCodigo(filters);
        }

        var binding = oEvent.getSource().getBinding("items");
        binding.filter(filters);
      },

      filtroCodigo: function (filters) {
        var result = "";
        var valores = [
          "idTpCotacao",
          "idOrgVend",
          "idFormaPag",
          "idCondPag",
          "idMotivo",
          "idBloqueio",
          "idIncoterms1",
        ];

        valores.forEach(function (oInput) {
          result = this.inputId.includes(oInput, 0);
          if (result) {
            filters[0].sPath = "cod";
          }
        }, this);

        return filters;
      },

      handleChange: function (oEvent) {
        var oDP = oEvent.getSource(),
          sValue = oEvent.getParameter("value"),
          bValid = oEvent.getParameter("valid");

        if (bValid) {
          oDP.setValueState(ValueState.None);
        } else {
          oDP.setValueState(ValueState.Error);
        }
      },

      handleCentro: function (oEvent) {
        this.limpaItens();

        var oDP = oEvent.getSource(),
          sValue = oEvent.getParameter("value");

        var valida = this.validaCentro();
        if (valida) {
          this.getView().byId(oDP.getId()).setValue();
        }
      },

      validaCentro: function () {
        var Itens = this.getView().getModel("ModelItens").getData().Itens;
        var vCentro = "";
        var vCount = 1;

        Itens.forEach(function (data) {
          if (vCentro === "") {
            vCentro = data.Centro;
          }

          if (vCentro !== data.Centro) {
            vCount = vCount + 1;
          }
        });

        if (vCount > 1) {
          MessageBox.alert("Existe Centros diferentes");
          return true;
        }
      },

      buscaModel: function (sField, model) {
		
        var this_ = this;
        var sCodigo = sField.getValue().toUpperCase();

        let result = sField.getId().includes(model, 0);
        var value = sField.getValue().toUpperCase();

        if (result) {
          if (sCodigo !== "") {
            if (model === "idVendedor") {
              Results.buscaVendedor(sCodigo, "").then(
                function (data) {
                  if (data.length === 1) {
                    this_
                      .getView()
                      .byId(model)
                      .setValue(data[0].cod + "-" + data[0].desc);
                  }
                },
                function (error) {}
              );
              return false;
            }

            if (model === "idRecebedor") {
              Results.buscaRecebedor(sCodigo, "").then(
                function (data) {
                  if (data.length === 1) {
                    this_
                      .getView()
                      .byId(model)
                      .setValue(data[0].cod + "-" + data[0].desc);
                  }
                },
                function (error) {}
              );
              return false;
            }

            if (model === "idEmissor") {
              Results.buscaEmissor(sCodigo, "").then(
                function (data) {
                  if (data.length === 1) {
                    this_
                      .getView()
                      .byId(model)
                      .setValue(data[0].cod + "-" + data[0].desc);
                  }
                },
                function (error) {}
              );
              return false;
            }

            if (model === "idMaterial") {
              Results.buscaMaterial(sCodigo, "").then(
                function (data) {
                  if (data.length === 1) {
                    this_
                      .getView()
                      .byId(model)
                      .setValue(data[0].cod + "-" + data[0].desc);
                  }
                },
                function (error) {}
              );
              return false;
            }

            if (this.getView().getModel(model) !== undefined) {
              var Itens = this.getView().getModel(model).getData().Itens;

              Itens.forEach(function (data) {
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

      buscaModelDialog: function (sField, model) {
        var this_ = this;
        var value = sField.getValue().toUpperCase();

        if (this.getView().getModel(model) !== undefined) {
          var Itens = this.getView().getModel(model).getData().Itens;

          Itens.forEach(function (data) {
            if (value === data.cod) {
              sap.ui
                .getCore()
                .byId(model)
                .setValue(data.cod + "-" + data.desc);
            }
          });
        }
      },

      buscaModelModificar: function (sField, model, __this) {
        var value = sField.getValue().toUpperCase();

        if (__this.getView().getModel(model) !== undefined) {
          var Itens = __this.getView().getModel(model).getData().Itens;
          var this_ = __this;

          Itens.forEach(function (data) {
            if (value === data.cod) {
              this_
                .getView()
                .byId(model)
                .setValue(data.cod + "-" + data.desc);
            }
          });
        }
      },

      handlePerda: function (oEvent) {
        var sInputValue, sSearchFiled;
        sInputValue = oEvent.getSource().getValue();
        if (sInputValue === "") {
          this.limpaItens();
        }
      },

      handleChangeAll: function (oEvent) {
        this.limpaItens();
        // Metodo responsavel por atribuir a descrição no campo caso o usuario opite por digitar na mão
        var sField = oEvent.getSource();
        this.buscaModel(sField, "idTpCotacao");
        this.buscaModel(sField, "idOrgVend");
        this.buscaModel(sField, "idCanal");
        this.buscaModel(sField, "idSetor");
        this.buscaModel(sField, "idEscritorio");
        this.buscaModel(sField, "idFormaPag");
        this.buscaModel(sField, "idUtilizacao");
        //	this.buscaModel(sField, "idRecebedor");
        this.buscaModel(sField, "idCondPag");
        this.buscaModel(sField, "idMotivo");
        this.buscaModel(sField, "idIncoterms1");
        this.buscaModel(sField, "idLocal");
        this.buscaModel(sField, "idVendedor");
        this.buscaModel(sField, "idEmissor");
        this.buscaModel(sField, "idIndicaoComercial");
        this.buscaModel(sField, "idBloqueio");
        this.buscaModel(sField, "idFreteValor");
        this.buscaModel(sField, "idMotivoRecusaItem");

        var result = sField.getId().includes("idMotivoRecusaItem", 0);
        if (result) {
          var sPath = "";
          var value = sField.getValue();
          if (sField.getValue() !== "") {
            var this_ = this;
            var Itens = this.getView()
              .getModel("idMotivoRecusaItem")
              .getData().Itens;
            Itens.forEach(function (data) {
              if (value === data.cod) {
                sPath =
                  sField.getBindingContext("ModelItens").getPath() +
                  "/MotivoRecusaItem";
                this_
                  .getView()
                  .getModel("ModelItens")
                  .setProperty(sPath, data.cod + "-" + data.desc);
              }
            });

            sPath =
              sField.getBindingContext("ModelItens").getPath() + "/isEnabled";
            this.getView().getModel("ModelItens").setProperty(sPath, false);
          } else {
            sPath =
              sField.getBindingContext("ModelItens").getPath() + "/isEnabled";
            this.getView().getModel("ModelItens").setProperty(sPath, true);
          }
        }
      },

      handlerDadosAdicionais: function (oEvent) {
        var sField = oEvent.getSource();
        var model = oEvent.getSource().getId();

        var value = sField.getValue().toUpperCase();
        if (this.getView().getModel(model) !== undefined) {
          var Itens = this.getView().getModel(model).getData().Itens;
          var this_ = this;

          Itens.forEach(function (data) {
            if (value === data.cod) {
              sap.ui
                .getCore()
                .byId(model)
                .setValue(data.cod + "-" + data.desc);
            }
          });
        }
      },

      handleRecebedor: function (oEvent) {
        this.limpaItens();

        var oDP = oEvent.getSource(),
          sValue = oEvent.getParameter("value"),
          this_ = this;

        //Busca Model - para preencher manualmente a descrição
        this.buscaModel(oDP, "idRecebedor");

        if (sValue !== undefined && sValue !== "") {
          Results.buscaTextoEmissor(sValue).then(
            function (data) {
              var oData = {};
              var oModel = new JSONModel();
              var concatenar = "";
              oData.Itens = data;
              oModel.setData(oData);
              this_.getView().setModel(oModel, "textos");

              for (var i = 0; i < data.length; i++) {
                if (data[i].Cod === "001") {
                  if (i === 0) {
                    concatenar = concatenar + data[i].Lines;
                  } else {
                    concatenar = concatenar + "\n" + data[i].Lines;
                  }
                }
              }

              //this_.getView().byId("idTexto").setValue(concatenar);
            },
            function (error) {}
          );
        }
      },

      handleEmissor: function (oEvent) {
        this.limpaItens();
        var oDP = oEvent.getSource(),
          sValue = oEvent.getParameter("value"),
          this_ = this;

        this_.getView().byId("idCNPJ").setValue("");
        //Busca Model - para preencher manualmente a descrição
        var sCodigo = this.buscaCodigo(oDP.getValue());
        if (sCodigo !== "") {
          var sCPF = "";
          var sCNPJ = "";
          if (sCodigo.length === 14) {
            sCNPJ = sCodigo;
            sCodigo = "";
          } else if (sCodigo.length === 11) {
            sCPF = sCodigo;
            sCodigo = "";
          }

          this_.getView().byId("idCNPJ").setValue("");
          Results.buscaEmissor(sCodigo, "", sCPF, sCNPJ).then(
            function (data) {
              if (data.length === 1) {
                oDP.setValue(data[0].cod + "-" + data[0].desc);
                this_.getView().byId("idCNPJ").setValue(data[0].cnpj);
                //Busca dados de Incoterms
                this_.buscaDadosIcotermsEmissor(this_);
              }
            },
            function (error) {}
          );

          this.buscaDadosRecebedor(sValue);
        }
      },

      handleValor: function (oEvent) {
        this.limpaItens();
        var oDP = oEvent.getSource(),
          sValue = oEvent.getParameter("value");
        sValue = sValue.replace(".", "");
        sValue = sValue.replace(",", ".");
        if (isNaN(sValue)) {
          MessageBox.alert("Favor prencher o campo com o valor correto");
          this.getView().byId(oDP.getId()).setValue();
          oDP.focus();
        }

        var result = oDP.getId().includes("idPrecoI", 0);
        if (result){
          var oRow = this.getView().getModel("ModelItens").getProperty(
            oDP.getBindingContext("ModelItens").getPath()
          );
            oRow.Preco2 = oRow.Preco;
        }

      },

      buscaDadosRecebedor: function (sValue) {
        var this_ = this;
        var iOrgVendas = this.retornaValor(
          this.getView().byId("idOrgVend").getValue()
        );
        var iCanalDist = this.retornaValor(
          this.getView().byId("idCanal").getValue()
        );
        var iSetor = this.retornaValor(
          this.getView().byId("idSetor").getValue()
        );
        var iRecebedor = this.getView().byId("idRecebedor").getValue();

        if (sValue !== undefined && sValue !== "") {
          //&& iRecebedor === "") {
          this_.getView().setBusy(true);
          Results.buscaRecebedorEmissor(
            this.retornaValor(sValue),
            iOrgVendas,
            iCanalDist,
            iSetor
          ).then(
            function (data) {
              var vLength = data.length;
              if (vLength === 1) {
                this_.getView().byId("idRecebedor").setValue(data[0].Recebedor);
                //this_.buscaModel(
                //      this_.getView().byId("idRecebedor"),
                //      "idRecebedor"
                //    );

                //Busca Texto
                sValue = this_.buscaCodigo(data[0].Recebedor);
                if (sValue !== undefined && sValue !== "") {
                  Results.buscaTextoEmissor(sValue).then(
                    function (data) {
                      var oData = {};
                      var oModel = new JSONModel();
                      var concatenar = "";
                      oData.Itens = data;
                      oModel.setData(oData);
                      this_.getView().setModel(oModel, "textos");

                      for (var i = 0; i < data.length; i++) {
                        if (data[i].Cod === "001") {
                          if (i === 0) {
                            concatenar = concatenar + data[i].Lines;
                          } else {
                            concatenar = concatenar + "\n" + data[i].Lines;
                          }
                        }
                      }

                      this_.getView().setBusy(false);
                    },
                    function (error) {
                      this_.getView().setBusy(false);
                    }
                  );
                }
              }
              this_.getView().setBusy(false);
            },
            function (error) {
              this_.getView().setBusy(false);
            }
          );
        }
      },

      handleLinkPress1: function (oEvent) {
        sap.ui.getCore().byId("link01").setEmphasized(true);
        //sap.ui.getCore().byId("link02").setEmphasized(false);
        sap.ui.getCore().byId("link03").setEmphasized(false);
        sap.ui.getCore().byId("link04").setEmphasized(false);
        sap.ui.getCore().byId("link05").setEmphasized(false);
        var concatenar = "";
        var data = 0;

        this.modificaTexto(valueLink);

        valueLink = "001";

        if (this.getView().getModel("textos") !== undefined) {
          data = this.getView().getModel("textos").getData().Itens;
        }

        for (var i = 0; i < data.length; i++) {
          if (data[i].Cod === "001") {
            if (concatenar === "") {
              concatenar = concatenar + data[i].Lines;
            } else {
              concatenar = concatenar + "\n" + data[i].Lines;
            }
          }
        }

        sap.ui.getCore().byId("idTexto").setValue(concatenar);
      },

      handleLinkPress2: function (oEvent) {
        sap.ui.getCore().byId("link01").setEmphasized(false);
        //sap.ui.getCore().byId("link02").setEmphasized(true);
        sap.ui.getCore().byId("link03").setEmphasized(false);
        sap.ui.getCore().byId("link04").setEmphasized(false);
        sap.ui.getCore().byId("link05").setEmphasized(false);
        var concatenar = "";
        var data = 0;

        this.modificaTexto(valueLink);
        valueLink = "002";

        if (this.getView().getModel("textos") !== undefined) {
          data = this.getView().getModel("textos").getData().Itens;
        }
        for (var i = 0; i < data.length; i++) {
          if (data[i].Cod === "002") {
            if (concatenar === "") {
              concatenar = concatenar + data[i].Lines;
            } else {
              concatenar = concatenar + "\n" + data[i].Lines;
            }
          }
        }

        sap.ui.getCore().byId("idTexto").setValue(concatenar);
      },
      handleLinkPress3: function (oEvent) {
        sap.ui.getCore().byId("link01").setEmphasized(false);
        //sap.ui.getCore().byId("link02").setEmphasized(false);
        sap.ui.getCore().byId("link03").setEmphasized(true);
        sap.ui.getCore().byId("link04").setEmphasized(false);
        sap.ui.getCore().byId("link05").setEmphasized(false);
        var concatenar = "";
        var data = 0;

        this.modificaTexto(valueLink);

        valueLink = "003";
        if (this.getView().getModel("textos") !== undefined) {
          data = this.getView().getModel("textos").getData().Itens;
        }
        for (var i = 0; i < data.length; i++) {
          if (data[i].Cod === "003") {
            if (concatenar === "") {
              concatenar = concatenar + data[i].Lines;
            } else {
              concatenar = concatenar + "\n" + data[i].Lines;
            }
          }
        }

        sap.ui.getCore().byId("idTexto").setValue(concatenar);
      },
      handleLinkPress4: function (oEvent) {
        sap.ui.getCore().byId("link01").setEmphasized(false);
        //sap.ui.getCore().byId("link02").setEmphasized(false);
        sap.ui.getCore().byId("link03").setEmphasized(false);
        sap.ui.getCore().byId("link04").setEmphasized(true);
        sap.ui.getCore().byId("link05").setEmphasized(false);
        var concatenar = "";
        var data = 0;

        this.modificaTexto(valueLink);

        valueLink = "004";
        if (this.getView().getModel("textos") !== undefined) {
          data = this.getView().getModel("textos").getData().Itens;
        }

        for (var i = 0; i < data.length; i++) {
          if (data[i].Cod === "004") {
            if (concatenar === "") {
              concatenar = concatenar + data[i].Lines;
            } else {
              concatenar = concatenar + "\n" + data[i].Lines;
            }
          }
        }

        sap.ui.getCore().byId("idTexto").setValue(concatenar);
      },
      handleLinkPress5: function (oEvent) {
        sap.ui.getCore().byId("link01").setEmphasized(false);
        //sap.ui.getCore().byId("link02").setEmphasized(false);
        sap.ui.getCore().byId("link03").setEmphasized(false);
        sap.ui.getCore().byId("link04").setEmphasized(false);
        sap.ui.getCore().byId("link05").setEmphasized(true);
        var concatenar = "";
        var data = 0;

        this.modificaTexto(valueLink);

        valueLink = "005";
        if (this.getView().getModel("textos") !== undefined) {
          data = this.getView().getModel("textos").getData().Itens;
        }

        for (var i = 0; i < data.length; i++) {
          if (data[i].Cod === "005") {
            if (concatenar === "") {
              concatenar = concatenar + data[i].Lines;
            } else {
              concatenar = concatenar + "\n" + data[i].Lines;
            }
          }
        }

        sap.ui.getCore().byId("idTexto").setValue(concatenar);
      },

      modificaTexto: function (sCod) {
        var oData = {};
        var oDados = {};
        var oModel = new JSONModel();

        var texto = sap.ui.getCore().byId("idTexto").getValue();
        var data = this.getView().getModel("textos").getData().Itens;
        var dados = [];
        var flag = "";
        var splitTexto = texto.split("\n");

        for (var i = 0; i < data.length; i++) {
          if (data[i].Cod !== sCod) {
            dados.push(data[i]);
          }
        }

        for (var o = 0; o < splitTexto.length; o++) {
          oDados = {
            Cod: sCod,
            Lines: splitTexto[o],
          };
          dados.push(oDados);
        }

        oData.Itens = dados;
        oModel.setData(oData);
        this.getView().setModel(oModel, "textos");
      },

      _handleValueHelpClose: function (evt) {
        //Atribui o valor do search help para o campo
        var oSelectedItem, fieldInput;

        oSelectedItem = evt.getParameter("selectedItem");

        if (oSelectedItem) {
          fieldInput = this.getView().byId(this.inputId);

          //Caso for search help dos dialogs
          if (fieldInput === undefined) {
            this.atribuiValorSearchHelpDadosAdicionais(
              this.inputId,
              oSelectedItem
            );
            return;
          } else {
            //Caso for Material ou outros
            let result = fieldInput.getId().includes("idMaterial", 0);

            if (result) {
              this.limpaItens();
              //Modifica Material ao escolher no machode
              fieldInput.setValue(oSelectedItem.getTitle());

              //Modifica Descrição do Material
              var descMaterial = fieldInput.getId().toString();
              descMaterial = descMaterial.replace(
                "idMaterial",
                "idDescMaterial"
              );

              //Buscar o ByID do campo idUM da tabela, para modificar
              var UmModificar = descMaterial;
              UmModificar = UmModificar.replace("idDescMaterial", "idUm");

              var inputDescMaterial = this.getView().byId(descMaterial);
              inputDescMaterial.setText(oSelectedItem.getDescription());

              var idCentro = descMaterial;
              idCentro = idCentro.replace("idDescMaterial", "idCentro");

              //Modifica Unidade de Medida
              var idMaterial = oSelectedItem.getTitle();
              var iOrgVendas = this.retornaValor(
                this.getView().byId("idOrgVend").getValue()
              );
              var iCanalDist = this.retornaValor(
                this.getView().byId("idCanal").getValue()
              );
              var __this = this;

              var iEmissor = this.retornaValor(
                this.getView().byId("idEmissor").getValue()
              );
              var iCentro = this.getView().byId(idCentro).getValue();
              var sPath1 = "";

              Results.buscaPreco(
                idMaterial,
                iOrgVendas,
                iCanalDist,
                iCentro,
                iEmissor
              ).then(
                function (data) {
                  //Atribui a Unidade de Medida achada e Valor

                  if (data.length === 1) {
                    sPath1 = gPath + "/Preco";
                    __this .getView().getModel("ModelItens").setProperty(sPath1, data[0].Valor);

                    sPath1 = gPath + "/Preco2";
                    __this .getView().getModel("ModelItens").setProperty(sPath1, data[0].Valor);

                    sPath1 = gPath + "/UM";
                    __this
                      .getView()
                      .getModel("ModelItens")
                      .setProperty(sPath1, data[0].UnidadeMedida);
                  }
                },
                function (error) {}
              );

              /*
						Results.buscaUnidadeMedidaVenda(idMaterial, iOrgVendas, iCanalDist)
							.then(function (data) {
								//Atribui a Unidade de Medida achada
								var idUm = __this.byId(UmModificar);
								idUm.setValue(data[0].Un);

							},
								function (error) { }); */
            } else {
              result = fieldInput.getId().includes("idUm", 0);

              if (result) {
                sap.ui
                  .getCore()
                  .byId("idUm")
                  .setValue(oSelectedItem.getTitle());
              } else {
                result = fieldInput.getId().includes("idCentro", 0);
                if (result) {
                  this.limpaItens();
                  fieldInput.setValue(oSelectedItem.getTitle());

                  var valida = this.validaCentro();
                  if (valida) {
                    fieldInput.setValue();
                  }
                } else {
                  this.limpaItens();
                 
                  if (oSelectedItem.getDescription()!==""){
                    fieldInput.setValue(
                      oSelectedItem.getTitle() +
                        "-" +
                        oSelectedItem.getDescription()
                    );
                  }else{
                    fieldInput.setValue(
                      oSelectedItem.getTitle()
                    );
                  }

                  result = fieldInput.getId().includes("idLocal", 0);
                  if (result) {
                    this.onDadosAdicionais();
                  }
                }
              }
            }
          }
          //Busca textos
          var this_ = this;
          let result = this.inputId.includes("idRecebedor", 0);
          if (result) {
            this.limpaItens();
            Results.buscaTextoEmissor(fieldInput.getValue()).then(
              function (data) {
                var oData = {};
                var oModel = new JSONModel();
                var concatenar = "";
                oData.Itens = data;
                oModel.setData(oData);
                this_.getView().setModel(oModel, "textos");
                this_.getView().setModel(oModel, "textosOld");

                for (var i = 0; i < data.length; i++) {
                  if (data[i].Cod === "001") {
                    if (i === 0) {
                      concatenar = concatenar + data[i].Lines;
                    } else {
                      concatenar = concatenar + "\n" + data[i].Lines;
                    }
                  }
                }

                this_.getView().byId("idTexto").setValue(concatenar);
              },
              function (error) {}
            );
          }

          result = this.inputId.includes("idEmissor", 0);
          if (result) {
            var sCodigo = this.retornaValor(fieldInput.getValue());
            this_.getView().byId("idCNPJ").setValue("");
            Results.buscaEmissor(sCodigo, "").then(
              function (data) {
                if (data.length === 1) {
                  this_.getView().byId("idCNPJ").setValue(data[0].cnpj);
                  //Busca dados de Incoterms
                  this_.buscaDadosIcotermsEmissor(this_);
                }
              },
              function (error) {}
            );

            this.buscaDadosRecebedor(fieldInput.getValue());
          }

          result = this.inputId.includes("idMotivoRecusaItem", 0);
          if (result) {
            if (fieldInput.getValue() !== "") {
              var sPath =
                fieldInput.getBindingContext("ModelItens").getPath() +
                "/isEnabled";
              this.getView().getModel("ModelItens").setProperty(sPath, false);
            }
          }
        }
        //evt.getSource().getBinding("items").filter([]);
      },

      atribuiValorSearchHelpDadosAdicionais: function (sField, oSelectedItem) {
        var fieldInput = sap.ui.getCore().byId(sField);
        var result = fieldInput.getId().includes(sField, 0);
        if (result) {
          fieldInput.setValue(
            oSelectedItem.getTitle() + "-" + oSelectedItem.getDescription()
          );
        }
      },

      onChangedesc: function (oEvent) {
        this.limpaItens();
        var fieldInput;
        var sPath;

        fieldInput = oEvent.oSource;

        //Não deixa preencher os dois campos de descontos juntos, um ou outro
        let result = fieldInput.getId().includes("idCDescR", 0);

        if (result) {
          this.handleValor(oEvent);
          this.getView().byId("idCDescP").setValue();
        }

        result = fieldInput.getId().includes("idCDescP", 0);

        if (result) {
          this.handleValor(oEvent);
          this.getView().byId("idCDescR").setValue();
        }

        result = fieldInput.getId().includes("idDPMateiral", 0);

        if (result) {
          sPath =
            oEvent.getSource().getBindingContext("ModelItens").getPath() +
            "/Desconto";
          this.getView().getModel("ModelItens").setProperty(sPath, "");
        }

        result = fieldInput.getId().includes("idDRPMateiral", 0);

        if (result) {
          sPath =
            oEvent.getSource().getBindingContext("ModelItens").getPath() +
            "/DescPercentual";
          this.getView().getModel("ModelItens").setProperty(sPath, "");
        }
      },

      onDialogPress: function (oEvent) {
        //Guarda o valor do material
        var idMaterial = oEvent
          .getSource()
          .getBindingContext("ModelItens")
          .getObject().Material;
        sap.ui.getCore().setModel(idMaterial, "idMaterial");
        //Seta valor da Unidade de venda
        var idUM = oEvent
          .getSource()
          .getBindingContext("ModelItens")
          .getObject().UM;
        sap.ui.getCore().setModel(idUM, "idUmc");
        //Guarda o valor do item
        var idUM = oEvent
          .getSource()
          .getBindingContext("ModelItens")
          .getObject().Item;
        sap.ui.getCore().setModel(idUM, "idItem");
        //Guarda qual item foi selecionado
        var sPath = oEvent.getSource().getBindingContext("ModelItens").sPath;
        sap.ui.getCore().setModel(sPath, "sPath");
        //Guarda o Valor
        var idQtd = oEvent
          .getSource()
          .getBindingContext("ModelItens")
          .getObject().Qtd;
        sap.ui.getCore().setModel(idQtd, "idQtd");

        //if (!this.__oDialog) {
        this.__oDialog = sap.ui.xmlfragment(
          "com.assistente.view.Conversao",
          this
        );
        this.getView().addDependent(this.__oDialog);

        this.getView().addDependent(this.__oDialog);
        //}
        this.__oDialog.open();
      },

      dialogAfteropen(oEvent) {
        //Atribui o valor da unidade de venda no dialog
        var idUMC = sap.ui.getCore().getModel("idUmc");
        sap.ui.getCore().byId("idUMC").setValue(idUMC);

        //Atribui o valor
        var idQtd = sap.ui.getCore().getModel("idQtd");
        sap.ui.getCore().byId("idQtd").setValue(idQtd);

        var idMaterial = sap.ui.getCore().getModel("idMaterial");
        var this_ = this;

        this_.getView().setBusy(true);
        Results.buscaUnidadeMedida(idMaterial).then(
          function (data) {
            var oData = {};
            var oModelSearch = new JSONModel();
            oData.Itens = data;
            oModelSearch.setData(oData);
            this_.getView().setModel(oModelSearch, "idUm");
            this_.getView().setBusy(false);
          },
          function (error) {
            this_.getView().setBusy(false);
          }
        );
      },

      onAtribuir(oEvent) {
        //Pega valor que foi convertido no dialog
        var sQtd = sap.ui.getCore().byId("idQtdC").getValue();
        //Busca Path(Item) que vai ser atualizado
        var sPath = sap.ui.getCore().getModel("sPath") + "/Qtd";
        //Atualiza model
        this.getView().getModel("ModelItens").setProperty(sPath, sQtd);

        this.__oDialog.close();
        this.__oDialog.destroy();
      },

      onConverter(oEvent) {
        this.onBuscaValoresConvertidos();
        //this.__oDialog.close();
      },

      onBuscaValoresConvertidos: function (oEvent) {
        var iMaterial = sap.ui.getCore().getModel("idMaterial");
        var idUm = sap.ui.getCore().byId("idUm").getValue();
        var idUMC = sap.ui.getCore().byId("idUMC").getValue();
        var idQtd = sap.ui.getCore().byId("idQtd").getValue();
        var idQtdC = sap.ui.getCore().byId("idQtdC");
        var __this = this;
        Results.buscaConversao(iMaterial, idUm, idUMC, idQtd, idQtdC).then(
          function (data) {
            idQtdC.setValue(__this.formatter.price3(data[0].Qtd));
          },
          function (error) {}
        );
      },

      closeDialog: function (oEvent) {
        this.__oDialog.close();
      },

      dialogAfterclose: function (oEvent) {
        this.__oDialog.destroy();
      },

      retornaValor: function (value) {
        var value1 = value.split("-");
        return value1[0];
      },

      handleLocal: function (oEvent) {
        var sField = oEvent.getSource();
        this.buscaModel(sField, "idLocal");
        this.onDadosAdicionais(oEvent);
      },

      onSelectionChange: function (oEvent) {
        // Busca linha selecionada
        //var sPatch = oEvent.getParameter("listItem").getBindingContext("Model1").sPath;
        var sPatch = oEvent
          .getSource()
          .getBindingContext("ModelItens")
          .getPath();
        var index = sPatch.substring(sPatch.length - 1);
        var oSource = oEvent.getSource();
        var oModel = oSource.getModel("ModelItens");
        var oRow = oModel.getProperty(sPatch);

        sap.ui.getCore().setModel(sPatch, "sPath");

        if (oRow.DataConfirmada !== undefined) {
          sap.ui.getCore().setModel(oRow.DataConfirmada, "idDataConfirmada");
        }

        if (oRow.Perda !== undefined) {
          sap.ui.getCore().setModel(oRow.Perda, "idPerda");
        }

        if (oRow.MotivoRecusaItem !== undefined) {
          sap.ui
            .getCore()
            .setModel(oRow.MotivoRecusaItem, "idMotivoRecusaItem");
        }

        if (oRow.DataDesejada !== undefined && oRow.DataDesejada !== "") {
          sap.ui.getCore().setModel(oRow.DataDesejada, "idDataDesejada");
        } else {
          var dateI = new Date();
          sap.ui
            .getCore()
            .setModel(dateI.toLocaleDateString(), "idDataDesejada");
        }

        if (oRow.PlanoCorte !== undefined) {
          sap.ui
            .getCore()
            .setModel(oRow.PlanoCorte.replaceAll(";", "\n"), "idPlano");
        }

        if (this._oDialog2) {
          this._oDialog2.destroy();
        }

        this._oDialog2 = sap.ui.xmlfragment(
          "com.assistente.view.LineItem",
          this
        );
        this.getView().addDependent(this._oDialog2);

        // toggle compact style
        jQuery.sap.syncStyleClass(
          "sapUiSizeCompact",
          this.getView(),
          this._oDialog2
        );

        this._oDialog2.setTitle("Dados do Item:" + oRow.Item);

        var __this = this;
        var idCanal = this.getView().byId("idCanal").getValue();
        var idCliente = this.getView().byId("idEmissor").getValue();
        var idOrgVend = this.getView().byId("idOrgVend").getValue();

        if (oRow.LocalItem !== undefined && oRow.LocalItem !== "") {
          oRow.LocalItem = oRow.LocalItem.replaceAll(";", "\n");
          sap.ui.getCore().setModel(oRow.LocalItem, "idLocal");
          __this._oDialog2.open();
        } else {
          __this.getView().setBusy(true);
          Results.buscaTextoMaterialCliente(
            oRow.Material,
            idCanal,
            idCliente,
            idOrgVend
          ).then(
            function (data) {
              sap.ui.getCore().setModel(data[0].Texto, "idLocal");
              __this.getView().setBusy(false);
              __this._oDialog2.open();
            },
            function (error) {
              __this.getView().setBusy(false);
              __this._oDialog2.open();
            }
          );
        }
      },

      onPressLinkLineItem10(oEvent) {
        sap.ui.getCore().byId("link10").setEmphasized(true);
        sap.ui.getCore().byId("link20").setEmphasized(false);
        sap.ui.getCore().byId("idLocal").setVisible(true);
        sap.ui.getCore().byId("idPlano").setVisible(false);
      },
      onPressLinkLineItem20(oEvent) {
        sap.ui.getCore().byId("link10").setEmphasized(false);
        sap.ui.getCore().byId("link20").setEmphasized(true);
        sap.ui.getCore().byId("idLocal").setVisible(false);
        sap.ui.getCore().byId("idPlano").setVisible(true);
      },

      dialogItemAfteropen(oEvent) {
        sap.ui.getCore().byId("link10").setEmphasized(true);
        sap.ui.getCore().byId("idLocal").setVisible(true);
        sap.ui.getCore().byId("idPlano").setVisible(false);
        var idPlano = sap.ui.getCore().getModel("idPlano");
        sap.ui.getCore().byId("idPlano").setEditable(false);
        sap.ui.getCore().byId("idPlano").setValue(idPlano);

        //Atribui o texto
        var idLocal = sap.ui.getCore().getModel("idLocal");

        sap.ui.getCore().byId("idLocal").setValue(idLocal);

        //Atribui data confirmada
        var idDataConfirmada = sap.ui.getCore().getModel("idDataConfirmada");
        sap.ui.getCore().byId("idDataConfirmada").setValue(idDataConfirmada);

        var idDataDesejada = sap.ui.getCore().getModel("idDataDesejada");
        sap.ui.getCore().byId("idDataDesejada").setValue(idDataDesejada);

        var idMotivoRecusaItem = sap.ui
          .getCore()
          .getModel("idMotivoRecusaItem");
        sap.ui
          .getCore()
          .byId("idMotivoRecusaItem")
          .setValue(idMotivoRecusaItem);

        var idPerda = sap.ui.getCore().getModel("idPerda");
        sap.ui.getCore().byId("idPerda").setValue(idPerda);

        this.buscaModelDialog(
          sap.ui.getCore().byId("idMotivoRecusaItem"),
          "idMotivoRecusaItem"
        );

        //Local da primeira tela
        var local = this.getView().byId("idLocal").getValue();
        //Se local estiver preenchido desabilitar local da tela de itens
        if (local === "" || local === undefined) {
          sap.ui.getCore().byId("idLocal").setEditable(false);
        } else {
          sap.ui.getCore().byId("idLocal").setEditable(true);
        }

        var sStateView = stateView;
        if (idMotivoRecusaItem!=="" && idMotivoRecusaItem!==undefined){
          sStateView = "VISUALIZA";
        }
        //Seta estado dos campos
        this.stateLineItem(sStateView);
      },

      onAtribuirItem(oEvent) {
        //Busca dados do Dialog
        var sPerda = sap.ui.getCore().byId("idPerda").getValue();
        var sMotivoRecusa = sap.ui
          .getCore()
          .byId("idMotivoRecusaItem")
          .getValue();
        var sLote = sap.ui.getCore().byId("idLote").getValue();
        var sDataDesejada = sap.ui.getCore().byId("idDataDesejada").getValue();
        var sDataConfirmada = sap.ui
          .getCore()
          .byId("idDataConfirmada")
          .getValue();

        //Busca Local - Text Area
        var sLocal = sap.ui.getCore().byId("idLocal").getValue();
        var vLocal = sLocal.split("\n");
        var vLength = vLocal.length;
        var texto = "";

        for (var o = 0; o < vLocal.length; o++) {
          if (o === 0) {
            texto = vLocal[o];
          } else {
            texto = texto + ";" + vLocal[o];
          }
        }

        //Busca Path(Item) que vai ser atualizado
        var sPath = sap.ui.getCore().getModel("sPath") + "/Lote";
        //Atualiza model
        this.getView().getModel("ModelItens").setProperty(sPath, sLote);
        sPath = sap.ui.getCore().getModel("sPath") + "/DataDesejada";
        this.getView().getModel("ModelItens").setProperty(sPath, sDataDesejada);
        sPath = sap.ui.getCore().getModel("sPath") + "/DataConfirmada";
        this.getView()
          .getModel("ModelItens")
          .setProperty(sPath, sDataConfirmada);

        sPath = sap.ui.getCore().getModel("sPath") + "/MotivoRecusaItem";
        this.getView().getModel("ModelItens").setProperty(sPath, sMotivoRecusa);

        sPath = sap.ui.getCore().getModel("sPath") + "/Perda";
        this.getView().getModel("ModelItens").setProperty(sPath, sPerda);

        sPath = sap.ui.getCore().getModel("sPath") + "/LocalItem";
        this.getView().getModel("ModelItens").setProperty(sPath, texto);

        if (sMotivoRecusa !== "") {
          sPath = sap.ui.getCore().getModel("sPath") + "/isEnabled";
          this.getView().getModel("ModelItens").setProperty(sPath, false);
        } else {
          sPath = sap.ui.getCore().getModel("sPath") + "/isEnabled";
          this.getView().getModel("ModelItens").setProperty(sPath, true);
        }

        this._oDialog2.close();
        this._oDialog2.destroy();
      },

      closeDialogItem: function (oEvent) {
        this._oDialog2.close();
      },

      dialogItemAfterclose: function (oEvent) {
        this._oDialog2.destroy();
      },

      onCalcular: function (oEvent) {
        //Valida Campos Obrigatórios
        var validate = this.onValidaCamposCriacaoCotacao();
        if (validate) {
          return;
        }

        this.getView().byId("idOK").setEnabled(true);
        gCalculate = "X";
        //Busca Dados de tela e da model(itens)
        var dadosTela = this.buscaDadosTela();
        this.getView().setBusy(true);
        var __this = this;
        Results.buscaDadosItens(dadosTela).then(
          function (data) {
            __this.getView().byId("idCPeso").setValue(data[0].PesoC);
            __this.getView().byId("idCIcms").setValue(data[0].IcmsC);
            __this.getView().byId("idCSt").setValue(data[0].StC);
            __this.getView().byId("idCIpi").setValue(data[0].IpiC);
            __this.getView().byId("idCValor").setValue(data[0].ValorTotal);
            __this.getView().byId("idCJuros").setValue(data[0].Juros);

            //DataConfirmada - olhar

            //data[0].PrecoCalculado// item
            //var itens = __this.getView().getModel("ModelItens").getData().Itens;
            var count = 0;
            //////////////
            var oData = {};
            var dados = [];

            var itens = __this.getView().byId("idProductsTable").getItems();

            for (var i = 0; i < data.length; i++) {
              //dados.push(data[i]);
              count = count + 1;

              //itens[i].getCells()[11].setText(data[i].IcmsI); //ICMS
              //itens[i].getCells()[12].setText(data[i].StI); //ST
              //itens[i].getCells()[13].setText(data[i].IpiI); //IPI
              //itens[i].getCells()[14].setValue(data[i].ComissaoI); //Comissao
              //itens[i].getCells()[15].setText(data[i].ValorItem); //Valor Item
              __this.getView().getModel("ModelItens").getData().Itens[
                i
              ].DataConfirmada = data[i].DataConfirmada;
              __this.getView().getModel("ModelItens").getData().Itens[i].ICMS =
                data[i].IcmsI;
              __this.getView().getModel("ModelItens").getData().Itens[i].ST =
                data[i].StI;
              __this.getView().getModel("ModelItens").getData().Itens[i].IPI =
                data[i].IpiI;
              //__this.getView().getModel("ModelItens").getData().Itens[i].Comissao = data[i].ComissaoI;
              __this.getView().getModel("ModelItens").getData().Itens[
                i
              ].ValorItem = data[i].ValorItem;
            }

            //oData.Itens = dados;
            //var oJsonModel = new JSONModel(oData);
            //oJsonModel.setSizeLimit(5000);
            //__this.getView().setModel(oJsonModel, "ModelItens");
            __this.getView().byId("idProductsTable").getModel().refresh(true);
            __this.getView().getModel("ModelItens").refresh(true);
            __this.getView().setBusy(false);
            __this.getView().byId("idCItens").setValue(count);

            var mensagem = data[0].Mensagem;
            MessageBox.alert(mensagem);
          },
          function (error) {
            //Erro ao calcular
            MessageBox.alert("Erro ao chamar gatewey");
            __this.getView().setBusy(false);
          }
        );
      },

      buscaDadosTela: function (sTipo) {
        var valueCabecalho = "";
        var valueTipoCabecalho = "";
        var valueItem = "";
        var valueTipoItem = "";
        var frete = "";
        var dadosAdicionais = this.getView()
          .getModel("dadosAdicionais")
          .getData().Itens;

        //if (sTipo === "Cria") {
        //	this.insereTextoDadosAdicionais();
        //}

        if (this.getView().byId("idFrete").getSelected()) {
          frete = "X";
        } else {
          frete = "";
        }

        if (this.getView().byId("idCDescR").getValue() !== "") {
          valueCabecalho = this.getView().byId("idCDescR").getValue();
          valueTipoCabecalho = "REAL";
        } else {
          valueCabecalho = this.getView().byId("idCDescP").getValue();
          valueTipoCabecalho = "PERCENTUAL";
        }

        //Busca Textos
        var concatenar1 = "",
          concatenar3 = "",
          concatenar4 = "",
          concatenar5 = "";

        var textos = this.getView().getModel("textos").getData().Itens;
        if (textos !== undefined) {
          for (var o = 0; o < textos.length; o++) {
            switch (textos[o].Cod) {
              case "001":
                if (concatenar1 === "") {
                  concatenar1 = concatenar1 + textos[o].Lines;
                } else {
                  concatenar1 = concatenar1 + ";" + textos[o].Lines;
                }
                break;
              case "003":
                if (concatenar3 === "") {
                  concatenar3 = concatenar3 + textos[o].Lines;
                } else {
                  concatenar3 = concatenar3 + ";" + textos[o].Lines;
                }
                break;
              case "004":
                if (concatenar4 === "") {
                  concatenar4 = concatenar4 + textos[o].Lines;
                } else {
                  concatenar4 = concatenar4 + ";" + textos[o].Lines;
                }
                break;
              case "005":
                if (concatenar5 === "") {
                  concatenar5 = concatenar5 + textos[o].Lines;
                } else {
                  concatenar5 = concatenar5 + ";" + textos[o].Lines;
                }
                break;
            }
          }
        }

        //Busca Itens
        var item = [];
        var dados = this.getView().getModel("ModelItens").getData();

        for (var i = 0; i < dados.Itens.length; i++) {
          if (dados.Itens[i].Desconto !== "") {
            valueItem = dados.Itens[i].Desconto;
            valueTipoItem = "REAL";
          } else {
            valueItem = dados.Itens[i].DescPercentual;
            valueTipoItem = "PERCENTUAL";
          }

          if (sTipo === undefined && sTipo !== "Criar") {
            item.push({
              TpCotacao: this.buscaCodigo(
                this.getView().byId("idTpCotacao").getValue()
              ),
              OrgVendas: this.buscaCodigo(
                this.getView().byId("idOrgVend").getValue()
              ),
              Canal: this.buscaCodigo(
                this.getView().byId("idCanal").getValue()
              ),
              Setor: this.buscaCodigo(
                this.getView().byId("idSetor").getValue()
              ),
              ValidoAte: this.converteData(
                this.getView().byId("idValidoAte").getValue()
              ),
              Escritorio: this.buscaCodigo(
                this.getView().byId("idEscritorio").getValue()
              ),
              Emissor: this.buscaCodigo(
                this.getView().byId("idEmissor").getValue()
              ),
              Pedido: this.getView().byId("idPedido").getValue(),
              Recebedor: this.buscaCodigo(
                this.getView().byId("idRecebedor").getValue()
              ),
              FormaPag: this.buscaCodigo(
                this.getView().byId("idFormaPag").getValue()
              ),
              CondPag: this.buscaCodigo(
                this.getView().byId("idCondPag").getValue()
              ),
              Utilizacao: this.buscaCodigo(
                this.getView().byId("idUtilizacao").getValue()
              ),
              Motivo: this.buscaCodigo(
                this.getView().byId("idMotivo").getValue()
              ),
              Vendedor: this.buscaCodigo(
                this.getView().byId("idVendedor").getValue()
              ),
              Incoterms1: this.buscaCodigo(
                this.getView().byId("idIncoterms1").getValue()
              ),
              Incoterms2: this.getView().byId("idIncoterms2").getValue(),
              DataPedido: this.converteData(
                this.getView().byId("idDataPedido").getValue()
              ),
              Frete: frete,
              Local: this.buscaCodigo(
                this.getView().byId("idLocal").getValue()
              ),
              //Cabeçalho Item
              //idCItens: this.getView().byId("idCItens").getValue(),
              PesoC: "", //this.getView().byId("idCPeso").getValue(),
              TipoDescCabecalho: valueTipoCabecalho,
              ValorDesconto: valueCabecalho,
              IcmsC: "", //this.getView().byId("idCIcms").getValue(),
              StC: "", //this.getView().byId("idCSt").getValue(),
              IpiC: "", //this.getView().byId("idCIpi").getValue(),
              ValorTotal: "", //this.getView().byId("idCValor").getValue(),
              //Itens
              Material: dados.Itens[i].Material,
              Itens: dados.Itens[i].Item.toString(),
              Quantidade: dados.Itens[i].Qtd,
              Centro: dados.Itens[i].Centro,
              Preco: dados.Itens[i].Preco,
              Um: dados.Itens[i].UM,
              Peso: dados.Itens[i].Qtd,
              DataDesejada: this.converteData(dados.Itens[i].DataDesejada),
              DataConfirmada: this.converteData(dados.Itens[i].DataConfirmada),
              MotivoRecusaItem: this.buscaCodigo(
                dados.Itens[i].MotivoRecusaItem
              ),
              Perda: dados.Itens[i].Perda,
              ValorDescontoItem: valueItem,
              TipoDescontoItem: valueTipoItem,
              IcmsI: dados.Itens[i].ICMS,
              StI: dados.Itens[i].ST,
              IpiI: dados.Itens[i].IPI,
              ComissaoI: dados.Itens[i].Comissao,
              ValorItem: dados.Itens[i].ValorItem,
              Lote: dados.Itens[i].Lote,
              Logadouro: dados.Itens[i].Logadouro,
              Bairro: dados.Itens[i].Bairro,
              Cidade: dados.Itens[i].Cidade,
              Uf: dados.Itens[i].Uf,
              Cep: dados.Itens[i].Cep,
              LocalItem: dados.Itens[i].LocalItem,
              DescRCabecalho: this.getView().byId("idCDescR").getValue(),
              DescpCabecalho: this.getView().byId("idCDescP").getValue(),
              DescR: dados.Itens[i].Desconto,
              DescP: dados.Itens[i].DescPercentual,
              Name1: dados.Itens[i].Name1,
              Doctype: "C",
              RefDoc: dados.Itens[i].RefDoc,
              RefItem: dados.Itens[i].RefItem,
              BlockRemessa: this.buscaCodigo(
                this.getView().byId("idBloqueio").getValue()
              ),
              Caracteristica: dados.Itens[i].Caracteristica,
              CaracteristicaValor: dados.Itens[i].CaracteristicaValor,
            });
          } else {
            item.push({
              Cotacao: gDocumento,
              TpCotacao: this.buscaCodigo(
                this.getView().byId("idTpCotacao").getValue()
              ),
              OrgVendas: this.buscaCodigo(
                this.getView().byId("idOrgVend").getValue()
              ),
              Canal: this.buscaCodigo(
                this.getView().byId("idCanal").getValue()
              ),
              Setor: this.buscaCodigo(
                this.getView().byId("idSetor").getValue()
              ),
              ValidoAte: this.converteData(
                this.getView().byId("idValidoAte").getValue()
              ),
              Escritorio: this.buscaCodigo(
                this.getView().byId("idEscritorio").getValue()
              ),
              Emissor: this.buscaCodigo(
                this.getView().byId("idEmissor").getValue()
              ),
              Pedido: this.getView().byId("idPedido").getValue(),
              Recebedor: this.buscaCodigo(
                this.getView().byId("idRecebedor").getValue()
              ),
              FormaPag: this.buscaCodigo(
                this.getView().byId("idFormaPag").getValue()
              ),
              CondPag: this.buscaCodigo(
                this.getView().byId("idCondPag").getValue()
              ),
              Utilizacao: this.buscaCodigo(
                this.getView().byId("idUtilizacao").getValue()
              ),
              Motivo: this.buscaCodigo(
                this.getView().byId("idMotivo").getValue()
              ),
              Vendedor: this.buscaCodigo(
                this.getView().byId("idVendedor").getValue()
              ),
              Incoterms1: this.buscaCodigo(
                this.getView().byId("idIncoterms1").getValue()
              ),
              Incoterms2: this.getView().byId("idIncoterms2").getValue(),
              DataPedido: this.converteData(
                this.getView().byId("idDataPedido").getValue()
              ),
              Frete: frete,
              Local: this.buscaCodigo(
                this.getView().byId("idLocal").getValue()
              ),
              //Cabeçalho Item
              //idCItens: this.getView().byId("idCItens").getValue(),
              PesoC: "", //this.getView().byId("idCPeso").getValue(),
              TipoDescCabecalho: valueTipoCabecalho,
              ValorDesconto: valueCabecalho,
              IcmsC: "", //this.getView().byId("idCIcms").getValue(),
              StC: "", //this.getView().byId("idCSt").getValue(),
              IpiC: "", //this.getView().byId("idCIpi").getValue(),
              ValorTotal: "", //this.getView().byId("idCValor").getValue(),
              //Itens
              Material: dados.Itens[i].Material,
              Itens: dados.Itens[i].Item.toString(),
              Quantidade: dados.Itens[i].Qtd,
              Centro: dados.Itens[i].Centro,
              Preco: dados.Itens[i].Preco2,
              Um: dados.Itens[i].UM,
              Peso: dados.Itens[i].Qtd,
              DataDesejada: this.converteData(dados.Itens[i].DataDesejada),
              DataConfirmada: this.converteData(dados.Itens[i].DataConfirmada),
              MotivoRecusaItem: this.buscaCodigo(
                dados.Itens[i].MotivoRecusaItem
              ),
              Perda: dados.Itens[i].Perda,
              ValorDescontoItem: valueItem,
              TipoDescontoItem: valueTipoItem,
              IcmsI: dados.Itens[i].ICMS,
              StI: dados.Itens[i].ST,
              IpiI: dados.Itens[i].IPI,
              ComissaoI: dados.Itens[i].Comissao,
              ValorItem: dados.Itens[i].ValorItem,
              Lote: dados.Itens[i].Lote,
              Logadouro: dados.Itens[i].Logadouro,
              Bairro: dados.Itens[i].Bairro,
              Cidade: dados.Itens[i].Cidade,
              Uf: dados.Itens[i].Uf,
              Cep: dados.Itens[i].Cep,
              LocalItem: dados.Itens[i].LocalItem,
              IndicacaoComercial: this.buscaCodigo(
                this.getView().byId("idIndicaoComercial").getValue()
              ),
              Observacao: concatenar1,
              Funcionamento: concatenar3,
              Entrega: concatenar4,
              Fiscal: concatenar5,
              Certificado: this.buscaCodigo(dadosAdicionais[0].Certificado),
              LimiteCarga: this.buscaCodigo(dadosAdicionais[0].LimiteCarga),
              LimiteVeiculo: this.buscaCodigo(dadosAdicionais[0].LimiteVeiculo),
              Recebimento: this.buscaCodigo(dadosAdicionais[0].Recebimento),
              Segmento: this.buscaCodigo(dadosAdicionais[0].Segmento),
              Restricao1: this.buscaCodigo(dadosAdicionais[0].Restricao1),
              Restricao2: this.buscaCodigo(dadosAdicionais[0].Restricao2),
              Restricao3: this.buscaCodigo(dadosAdicionais[0].Restricao3),
              Restricao4: this.buscaCodigo(dadosAdicionais[0].Restricao4),
              Restricao5: this.buscaCodigo(dadosAdicionais[0].Restricao5),
              DescRCabecalho: this.getView().byId("idCDescR").getValue(),
              DescpCabecalho: this.getView().byId("idCDescP").getValue(),
              DescR: dados.Itens[i].Desconto,
              DescP: dados.Itens[i].DescPercentual,
              Name1: dados.Itens[i].Name1,
              Doctype: "C",
              RefDoc: dados.Itens[i].RefDoc,
              RefItem: dados.Itens[i].RefItem,
              BlockRemessa: this.buscaCodigo(
                this.getView().byId("idBloqueio").getValue()
              ),
              Caracteristica: dados.Itens[i].Caracteristica,
              CaracteristicaValor: dados.Itens[i].CaracteristicaValor,
            });
          }
        }

        return item;
      },

      insereTextoDadosAdicionais: function (oEvent) {
        var oData = {};
        var oModel = new JSONModel();
        var data = [];
        var adicional;

        var itens = this.getView().getModel("textos").getData().Itens;
        var dadosAdicionais = this.getView()
          .getModel("dadosAdicionais")
          .getData().Itens;

        itens.forEach(function (oInput) {
          data.push(oInput);
        }, this);

        if (dadosAdicionais.length > 0) {
          adicional = {
            Cod: "001",
            Lines: "Certificado: " + dadosAdicionais[0].Certificado,
          };
          data.push(adicional);

          adicional = {
            Cod: "001",
            Lines: "Limite de Carga: " + dadosAdicionais[0].LimiteCarga,
          };
          data.push(adicional);

          adicional = {
            Cod: "001",
            Lines: "Limite de Veículo: " + dadosAdicionais[0].LimiteVeiculo,
          };
          data.push(adicional);

          adicional = {
            Cod: "001",
            Lines: "Rececimento parc.:" + dadosAdicionais[0].Recebimento,
          };
          data.push(adicional);

          adicional = {
            Cod: "001",
            Lines: "Segmento: " + dadosAdicionais[0].Segmento,
          };
          data.push(adicional);

          adicional = {
            Cod: "001",
            Lines: "Restrição 1: " + dadosAdicionais[0].Restricao1,
          };
          data.push(adicional);

          adicional = {
            Cod: "001",
            Lines: "Restrição 2: " + dadosAdicionais[0].Restricao2,
          };
          data.push(adicional);

          adicional = {
            Cod: "001",
            Lines: "Restrição 3: " + dadosAdicionais[0].Restricao3,
          };
          data.push(adicional);

          adicional = {
            Cod: "001",
            Lines: "Restrição 4: " + dadosAdicionais[0].Restricao4,
          };
          data.push(adicional);

          adicional = {
            Cod: "001",
            Lines: "Restrição 5: " + dadosAdicionais[0].Restricao5,
          };
          data.push(adicional);
        }

        oData.Itens = data;
        oModel.setData(oData);
        this.getView().setModel(oModel, "textos");
      },

      onSalvar: function (oEvent) {
        var this_ = this;
        MessageBox.confirm("Confirma salvamento da ordem de venda ?", {
          title: "Informação",
          initialFocus: sap.m.MessageBox.Action.CANCEL,
          onClose: function (sButton) {
            if (sButton === MessageBox.Action.OK) {
              this_.validaInformacao(this_);
            } else {
            }
          },
        });
      },

      onCancelar: function (oEvent) {},

      validaInformacao: function (oEvent) {
        //Valida Campos Obrigatórios
        var validate = oEvent.onValidaCamposCriacaoCotacao();
        if (validate) {
          return;
        }

        //Valida Centro
        validate = oEvent.validaCentro();
        if (validate) {
          return;
        }

        this.limpaState();
        var dados = oEvent.buscaDadosTela("Cria");

        this.getView().setBusy(true);
        var __this = this;

        if (stateView === "MODIFICA") {
          //Modifica Ordem
          Results.modificaOrdem(dados).then(
            function (data) {
              var mensagem = data[0].Mensagem;
              MessageBox.alert(mensagem);
              __this.getView().setBusy(false);

              if (mensagem.substr(0, 7) === "Ordem d") {
                stateView = "VISUALIZA";
                __this.setaEditable(false, __this);
                __this.getView().byId("idModificar").setEnabled(true);
                __this.getView().byId("idOK").setEnabled(false);
              }
            },
            function (error) {
              MessageBox.alert("Erro ao chamar o gateway");
              __this.getView().byId("idModificar").setEnabled(true);
              __this.getView().setBusy(false);
            }
          );
        } else {
          //Cria Ordem
          Results.criaOrdem(dados).then(
            function (data) {
              var mensagem = data[0].Mensagem;
              MessageBox.alert(mensagem);
              __this.getView().setBusy(false);
              //Limpa a tela em caso de sucesso
              if (mensagem.substr(0, 7) === "Ordem d") {
                stateView = "VISUALIZA";
                __this.setaEditable(false, __this);
                __this.getView().byId("idOK").setEnabled(false);
                
                gDocumento = mensagem.substr(16, 10);
                __this
                  .getView()
                  .byId("idDadosCotacao")
                  .setText("Dados da ordem " + gDocumento);
                __this.getView().byId("idModificar").setVisible(true);
                __this.getView().byId("idModificar").setEnabled(true);
              }
            },
            function (error) {
              MessageBox.alert("Erro ao chamar o gateway");
              __this.getView().setBusy(false);
            }
          );
        }
      },

      onValidaCamposCriacaoCotacao: function (oEvent) {
        var erro = false;

        var oView = this.getView(),
          aInputs = [
            oView.byId("idTpCotacao"),
            oView.byId("idOrgVend"),
            oView.byId("idCanal"),
            oView.byId("idEmissor"),
            oView.byId("idSetor"),
            oView.byId("idCondPag"),
            oView.byId("idIncoterms1"),
            oView.byId("idIncoterms2"),
          ],
          bValidationError = false;

        // Valida os campos da tela
        aInputs.forEach(function (oInput) {
          bValidationError = this._validateInput(oInput) || bValidationError;
          if (bValidationError === true) {
            oInput.focus();
          }
        }, this);

        //Valida os itens da tabela
        var itens = this.getView().byId("idProductsTable").getItems();
        var flag = "";
        itens.forEach(function (oInput) {
          erro = this._validateInputItens(oInput.getCells()[1]);
          if (erro) {
            flag = "X";
          }
          erro = this._validateInputItens(oInput.getCells()[3]);
          if (erro) {
            flag = "X";
          }
          erro = this._validateInputItens(oInput.getCells()[5]);
          if (erro) {
            flag = "X";
          }
          erro = this._validateInputItens(oInput.getCells()[6]);
          if (erro) {
            flag = "X";
          }
          erro = this._validateInputItens(oInput.getCells()[8]);
          if (erro) {
            flag = "X";
          }
        }, this);

        if (bValidationError || flag === "X") {
          erro = true;
          bValidationError = true;
          MessageBox.alert("Favor preencher os dados");
        }

        return bValidationError;
      },

      onDadosAdicionais: function (oEvent) {
        if (stateView === "CRIA") {
          var validate = this.onValidaDadosAdicionais();
          if (validate) {
            return;
          }
        }

        if (this._oDialog3) {
          this._oDialog3.destroy();
        }

        this._oDialog3 = sap.ui.xmlfragment(
          "com.assistente.view.DadosAdicionais",
          this
        );
        this.getView().addDependent(this._oDialog3);

        // toggle compact style
        jQuery.sap.syncStyleClass(
          "sapUiSizeCompact",
          this.getView(),
          this._oDialog3
        );

        this._oDialog3.setTitle("Informação:");

        var __this = this;

        __this._oDialog3.open();
      },

      onSalvarDadosAdicionais: function (oEvent) {
        //Atualiza campos da tela
        var dadosAdd;
        var dadosAddVet = [];

        this.modificaTexto(valueLink);

        dadosAdd = {
          Certificado: sap.ui.getCore().byId("idCertificado").getValue(),
          Segmento: sap.ui.getCore().byId("idSegmento").getValue(),
          LimiteCarga: sap.ui.getCore().byId("idLimiteCarga").getValue(),
          LimiteVeiculo: sap.ui.getCore().byId("idLimiteVeiculo").getValue(),
          Restricao1: sap.ui.getCore().byId("idRestricao1").getValue(),
          Restricao2: sap.ui.getCore().byId("idRestricao2").getValue(),
          Restricao3: sap.ui.getCore().byId("idRestricao3").getValue(),
          Restricao4: sap.ui.getCore().byId("idRestricao4").getValue(),
          Restricao5: sap.ui.getCore().byId("idRestricao5").getValue(),
          Recebimento: sap.ui.getCore().byId("idRecebimento").getValue(),
        };

        dadosAddVet.push(dadosAdd);

        var oModel1 = new JSONModel();
        var oData1 = {};
        oData1.Itens = dadosAddVet;
        oModel1.setData(oData1);
        this.getView().setModel(oModel1, "dadosAdicionais");

        var sLogadouro = sap.ui.getCore().byId("idLogadouro").getValue();
        var sBairro = sap.ui.getCore().byId("idBairro").getValue();
        var sCidade = sap.ui.getCore().byId("idCidade").getValue();
        var sUf = sap.ui.getCore().byId("idUF").getValue();
        var sCep = sap.ui.getCore().byId("idCep").getValue();
        var sName = sap.ui.getCore().byId("idName").getValue();

        var sPath = "/Itens/0" + "/Logadouro";
        this.getView().getModel("ModelItens").setProperty(sPath, sLogadouro);
        sPath = "/Itens/0" + "/Bairro";
        this.getView().getModel("ModelItens").setProperty(sPath, sBairro);

        sPath = "/Itens/0" + "/Cidade";
        this.getView().getModel("ModelItens").setProperty(sPath, sCidade);
        sPath = "/Itens/0" + "/Uf";
        this.getView().getModel("ModelItens").setProperty(sPath, sUf);
        sPath = "/Itens/0" + "/Cep";
        this.getView().getModel("ModelItens").setProperty(sPath, sCep);
        sPath = "/Itens/0" + "/Name1";
        this.getView().getModel("ModelItens").setProperty(sPath, sName);

        this._oDialog3.close();
        this._oDialog3.destroy();
      },

      closeDialogDadosAdicionais: function (oEvent) {
        this._oDialog3.close();
      },

      dialogDadosAdicionaisAfterclose: function (oEvent) {
        this._oDialog3.destroy();
      },

      onCancelarDadosAdicionais: function (oEvent) {
        this._oDialog3.close();
        this._oDialog3.destroy();
      },

      onBeforeDadosAdicionais: function (oEvent) {
        var dadosEntrega = this.getView().getModel("ModelItens").getData()
          .Itens[0];
        sap.ui.getCore().byId("idLogadouro").setValue(dadosEntrega.Logadouro);
        sap.ui.getCore().byId("idBairro").setValue(dadosEntrega.Bairro);
        sap.ui.getCore().byId("idCidade").setValue(dadosEntrega.Cidade);
        sap.ui.getCore().byId("idUF").setValue(dadosEntrega.Uf);
        sap.ui.getCore().byId("idCep").setValue(dadosEntrega.Cep);
        sap.ui.getCore().byId("idName").setValue(dadosEntrega.Name1);

        //Atualiza o estado dos campos edição ou visualização
        this.stateDadosAdicionais();

        valueLink = "001";
        //Atribui valor ao texto 001
        var concatenar = "";
        var dataText = this.getView().getModel("textos").getData().Itens;
        for (var i = 0; i < dataText.length; i++) {
          if (dataText[i].Cod === "001") {
            if (i === 0) {
              concatenar = concatenar + dataText[i].Lines;
            } else {
              concatenar = concatenar + "\n" + dataText[i].Lines;
            }
          }
        }

        sap.ui.getCore().byId("idTexto").setValue(concatenar);
        sap.ui.getCore().byId("link01").setEmphasized(true);

        var dadosAdicionais = this.getView()
          .getModel("dadosAdicionais")
          .getData().Itens;
        var idEmissor = this.getView().byId("idEmissor").getValue();
        var __this = this;

        if (dadosAdicionais.length > 0) {
          sap.ui
            .getCore()
            .byId("idCertificado")
            .setValue(dadosAdicionais[0].Certificado);
          sap.ui
            .getCore()
            .byId("idSegmento")
            .setValue(dadosAdicionais[0].Segmento);
          sap.ui
            .getCore()
            .byId("idLimiteCarga")
            .setValue(dadosAdicionais[0].LimiteCarga);
          sap.ui
            .getCore()
            .byId("idLimiteVeiculo")
            .setValue(dadosAdicionais[0].LimiteVeiculo);
          sap.ui
            .getCore()
            .byId("idRestricao1")
            .setValue(dadosAdicionais[0].Restricao1);
          sap.ui
            .getCore()
            .byId("idRestricao2")
            .setValue(dadosAdicionais[0].Restricao2);
          sap.ui
            .getCore()
            .byId("idRestricao3")
            .setValue(dadosAdicionais[0].Restricao3);
          sap.ui
            .getCore()
            .byId("idRestricao4")
            .setValue(dadosAdicionais[0].Restricao4);
          sap.ui
            .getCore()
            .byId("idRestricao5")
            .setValue(dadosAdicionais[0].Restricao5);
          sap.ui
            .getCore()
            .byId("idRecebimento")
            .setValue(dadosAdicionais[0].Recebimento);

          __this.buscaModelDialog(
            sap.ui.getCore().byId("idCertificado"),
            "idCertificado"
          );
          __this.buscaModelDialog(
            sap.ui.getCore().byId("idSegmento"),
            "idSegmento"
          );
          __this.buscaModelDialog(
            sap.ui.getCore().byId("idLimiteCarga"),
            "idLimiteCarga"
          );
          __this.buscaModelDialog(
            sap.ui.getCore().byId("idLimiteVeiculo"),
            "idLimiteVeiculo"
          );
          __this.buscaModelDialog(
            sap.ui.getCore().byId("idRestricao1"),
            "idRestricao1"
          );
          __this.buscaModelDialog(
            sap.ui.getCore().byId("idRestricao2"),
            "idRestricao2"
          );
          __this.buscaModelDialog(
            sap.ui.getCore().byId("idRestricao3"),
            "idRestricao3"
          );
          __this.buscaModelDialog(
            sap.ui.getCore().byId("idRestricao4"),
            "idRestricao4"
          );
          __this.buscaModelDialog(
            sap.ui.getCore().byId("idRestricao5"),
            "idRestricao5"
          );
          __this.buscaModelDialog(
            sap.ui.getCore().byId("idRecebimento"),
            "idRecebimento"
          );

          if (
            dadosAdicionais[0].Certificado === "" &&
            dadosAdicionais[0].Segmento === "" &&
            dadosAdicionais[0].LimiteCarga === "" &&
            dadosAdicionais[0].LimiteVeiculo === "" &&
            dadosAdicionais[0].Restricao1 === "" &&
            dadosAdicionais[0].Restricao2 === "" &&
            dadosAdicionais[0].Restricao3 === "" &&
            dadosAdicionais[0].Restricao4 === "" &&
            dadosAdicionais[0].Restricao5 === ""
          ) {
            Results.buscaDadosAdicionais(idEmissor).then(
              function (data) {
                //Atribui valor para o Dialog Dados Adicionais
                sap.ui
                  .getCore()
                  .byId("idCertificado")
                  .setValue(data[0].Certificado);
                sap.ui.getCore().byId("idSegmento").setValue(data[0].Segmento);

                __this.buscaModelDialog(
                  sap.ui.getCore().byId("idCertificado"),
                  "idCertificado"
                );
                __this.buscaModelDialog(
                  sap.ui.getCore().byId("idSegmento"),
                  "idSegmento"
                );
              },
              function (error) {}
            );

            idRecebedor = this.getView().byId("idRecebedor").getValue();
            Results.buscaDadosAdicionais(idRecebedor).then(
              function (data) {
                //Atribui valor para o Dialog Dados Adicionais

                sap.ui
                  .getCore()
                  .byId("idLimiteCarga")
                  .setValue(data[0].LimiteCarga);
                sap.ui
                  .getCore()
                  .byId("idLimiteVeiculo")
                  .setValue(data[0].LimiteVeiculo);
                sap.ui
                  .getCore()
                  .byId("idRestricao1")
                  .setValue(data[0].Restricao1);
                sap.ui
                  .getCore()
                  .byId("idRestricao2")
                  .setValue(data[0].Restricao2);
                sap.ui
                  .getCore()
                  .byId("idRestricao3")
                  .setValue(data[0].Restricao3);
                sap.ui
                  .getCore()
                  .byId("idRestricao4")
                  .setValue(data[0].Restricao4);
                sap.ui
                  .getCore()
                  .byId("idRestricao5")
                  .setValue(data[0].Restricao5);
                sap.ui
                  .getCore()
                  .byId("idRecebimento")
                  .setValue(data[0].Recebimento);

                __this.buscaModelDialog(
                  sap.ui.getCore().byId("idLimiteCarga"),
                  "idLimiteCarga"
                );
                __this.buscaModelDialog(
                  sap.ui.getCore().byId("idLimiteVeiculo"),
                  "idLimiteVeiculo"
                );
                __this.buscaModelDialog(
                  sap.ui.getCore().byId("idRestricao1"),
                  "idRestricao1"
                );
                __this.buscaModelDialog(
                  sap.ui.getCore().byId("idRestricao2"),
                  "idRestricao2"
                );
                __this.buscaModelDialog(
                  sap.ui.getCore().byId("idRestricao3"),
                  "idRestricao3"
                );
                __this.buscaModelDialog(
                  sap.ui.getCore().byId("idRestricao4"),
                  "idRestricao4"
                );
                __this.buscaModelDialog(
                  sap.ui.getCore().byId("idRestricao5"),
                  "idRestricao5"
                );
                __this.buscaModelDialog(
                  sap.ui.getCore().byId("idRecebimento"),
                  "idRecebimento"
                );
              },
              function (error) {}
            );
          }
        } else {
          Results.buscaDadosAdicionais(idEmissor).then(
            function (data) {
              //Atribui valor para o Dialog Dados Adicionais
              sap.ui
                .getCore()
                .byId("idCertificado")
                .setValue(data[0].Certificado);
              sap.ui.getCore().byId("idSegmento").setValue(data[0].Segmento);

              __this.buscaModelDialog(
                sap.ui.getCore().byId("idCertificado"),
                "idCertificado"
              );
              __this.buscaModelDialog(
                sap.ui.getCore().byId("idSegmento"),
                "idSegmento"
              );
            },
            function (error) {}
          );

          var idRecebedor = this.getView().byId("idRecebedor").getValue();
          Results.buscaDadosAdicionais(idRecebedor).then(
            function (data) {
              //Atribui valor para o Dialog Dados Adicionais

              sap.ui
                .getCore()
                .byId("idLimiteCarga")
                .setValue(data[0].LimiteCarga);
              sap.ui
                .getCore()
                .byId("idLimiteVeiculo")
                .setValue(data[0].LimiteVeiculo);
              sap.ui
                .getCore()
                .byId("idRestricao1")
                .setValue(data[0].Restricao1);
              sap.ui
                .getCore()
                .byId("idRestricao2")
                .setValue(data[0].Restricao2);
              sap.ui
                .getCore()
                .byId("idRestricao3")
                .setValue(data[0].Restricao3);
              sap.ui
                .getCore()
                .byId("idRestricao4")
                .setValue(data[0].Restricao4);
              sap.ui
                .getCore()
                .byId("idRestricao5")
                .setValue(data[0].Restricao5);
              sap.ui
                .getCore()
                .byId("idRecebimento")
                .setValue(data[0].Recebimento);

              __this.buscaModelDialog(
                sap.ui.getCore().byId("idLimiteCarga"),
                "idLimiteCarga"
              );
              __this.buscaModelDialog(
                sap.ui.getCore().byId("idLimiteVeiculo"),
                "idLimiteVeiculo"
              );
              __this.buscaModelDialog(
                sap.ui.getCore().byId("idRestricao1"),
                "idRestricao1"
              );
              __this.buscaModelDialog(
                sap.ui.getCore().byId("idRestricao2"),
                "idRestricao2"
              );
              __this.buscaModelDialog(
                sap.ui.getCore().byId("idRestricao3"),
                "idRestricao3"
              );
              __this.buscaModelDialog(
                sap.ui.getCore().byId("idRestricao4"),
                "idRestricao4"
              );
              __this.buscaModelDialog(
                sap.ui.getCore().byId("idRestricao5"),
                "idRestricao5"
              );
              __this.buscaModelDialog(
                sap.ui.getCore().byId("idRecebimento"),
                "idRecebimento"
              );
            },
            function (error) {}
          );
        }
      },

      setModelDialog: function (sValue, input) {
        var this_ = this;
        var sCodigo = "";
        var sNome = "";
        var value = "";
        var array = "";

        if (
          "idCertificado" === input ||
          "idSegmento" === input ||
          "idLimiteCarga" === input ||
          "idLimiteVeiculo" === input ||
          "idRestricao1" === input ||
          "idRestricao2" === input ||
          "idRestricao3" === input ||
          "idRestricao4" === input ||
          "idRecebimento" === input ||
          "idRestricao5" === input ||
          "idMotivoRecusaItem" === input
        ) {
        } else {
          array = this.getView().byId(input).getValue().split("-");
          value = array[0];
        }

        if ($.isNumeric(value)) {
          sCodigo = value;
        } else {
          sNome = value;
        }

        var oData1 = {};
        var oModelSearch1 = new JSONModel();
        var data1 = [];

        var result = input.includes(sValue, 0);
        if (result) {
          if (sValue === "idRecebedor" && (sCodigo !== "" || sNome !== "")) {
            Results.buscaRecebedor(sCodigo, sNome).then(
              function (data) {
                var oData = {};
                var oModelSearch = new JSONModel();
                oData.Itens = data;
                oModelSearch.setData(oData);
                this_.getView().setModel(oModelSearch, "idRecebedor");
                this_._oDialog.setModel(oModelSearch, "ModelSearch");
              },
              function (error) {}
            );
          } else {
            oData1.Itens = data1;
            oModelSearch1.setData(oData1);
            this_._oDialog.setModel(oModelSearch1, "ModelSearch");
          }
        }

        result = input.includes(sValue, 0);
        if (result) {
          if (sValue === "idEmissor" && (sCodigo !== "" || sNome !== "")) {
            var sCPF = "";
            var sCNPJ = "";
            if (sCodigo.length === 14) {
              sCNPJ = sCodigo;
              sCodigo = "";
            } else if (sCodigo.length === 11) {
              sCPF = sCodigo;
              sCodigo = "";
            }

            Results.buscaEmissor(sCodigo, sNome, sCPF, sCNPJ).then(
              function (data) {
                var oData = {};
                var oModelSearch = new JSONModel();
                oData.Itens = data;
                oModelSearch.setData(oData);
                this_.getView().setModel(oModelSearch, "idEmissor");
                this_._oDialog.setModel(oModelSearch, "ModelSearch");
              },
              function (error) {}
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
              function (data) {
                var oData = {};
                var oModelSearch = new JSONModel();
                oData.Itens = data;
                oModelSearch.setData(oData);
                this_.getView().setModel(oModelSearch, "idVendedor");
                this_._oDialog.setModel(oModelSearch, "ModelSearch");
              },
              function (error) {}
            );
          } else {
            oData1.Itens = data1;
            oModelSearch1.setData(oData1);
            this_._oDialog.setModel(oModelSearch1, "ModelSearch");
          }
        }

        result = input.includes(sValue, 0);
        if (result) {
          if (sValue === "idMaterial" && (sCodigo !== "" || sNome !== "")) {
            Results.buscaMaterial(sCodigo, sNome).then(
              function (data) {
                var oData = {};
                var oModelSearch = new JSONModel();
                oData.Itens = data;
                oModelSearch.setData(oData);
                this_.getView().setModel(oModelSearch, "idMaterial");
                this_._oDialog.setModel(oModelSearch, "ModelSearch");
              },
              function (error) {}
            );
          } else {
            oData1.Itens = data1;
            oModelSearch1.setData(oData1);
            this_._oDialog.setModel(oModelSearch1, "ModelSearch");
          }
        }

        result = input.includes(sValue, 0);
        if (result) {
          this_._oDialog.setModel(
            this.getView().getModel(sValue),
            "ModelSearch"
          );
        }
      },

      onValidaDadosAdicionais: function (oEvent) {
        var oView = this.getView(),
          aInputs = [oView.byId("idEmissor"), oView.byId("idRecebedor")],
          bValidationError = false;

        // Validation does not happen during data binding as this is only triggered by user actions.
        aInputs.forEach(function (oInput) {
          bValidationError = this._validateInput(oInput) || bValidationError;

          if (bValidationError) {
            oInput.focus();
          }
        }, this);

        if (bValidationError) {
          MessageBox.alert("Favor preencher os dados");
        }

        return bValidationError;
      },

      handleMaterial: function (oEvent) {
        this.limpaItens();

        var sPath = oEvent
          .getSource()
          .getBindingContext("ModelItens")
          .getPath();
        var oSource = oEvent.getSource();
        var oModel = oSource.getModel("ModelItens");
        var oRow = oModel.getProperty(sPath);

        var oDP = oEvent.getSource(),
          sValue = oEvent.getParameter("value"),
          this_ = this;

        //Modifica Descrição do Material
        var descMaterial = oDP.getId().toString();
        descMaterial = descMaterial.replace("idMaterial", "idDescMaterial");

        //Buscar o ByID do campo idUM da tabela, para modificar
        var UmModificar = descMaterial;
        UmModificar = UmModificar.replace("idDescMaterial", "idUm");

        var inputDescMaterial = this.getView().byId(descMaterial);

        // Busca Descrição do material
        var sCodigo = sValue;
        if (sCodigo !== "") {
          Results.buscaMaterial(sCodigo, "").then(
            function (data) {
              inputDescMaterial.setText(data[0].desc);
            },
            function (error) {}
          );
        }

        //Modifica Unidade de Medida
        var idMaterial = sValue;
        var iOrgVendas = this.retornaValor(
          this.getView().byId("idOrgVend").getValue()
        );
        var iCanalDist = this.retornaValor(
          this.getView().byId("idCanal").getValue()
        );
        var __this = this;

        //Results.buscaUnidadeMedidaVenda(idMaterial, iOrgVendas, iCanalDist)
        //.then(function (data) {
        //	//Atribui a Unidade de Medida achada
        //	var idUm = __this.byId(UmModificar);
        //	idUm.setValue(data[0].Un);
        //},
        //	function (error) { });

        var iEmissor = this.retornaValor(
          this.getView().byId("idEmissor").getValue()
        );
        var iCentro = oRow.Centro;
        var sPath1 = "";
        Results.buscaPreco(
          idMaterial,
          iOrgVendas,
          iCanalDist,
          iCentro,
          iEmissor
        ).then(
          function (data) {
            //Atribui a Unidade de Medida achada e Valor

            if (data.length === 1) {

              sPath1 = sPath + "/Preco";
              this_.getView().getModel("ModelItens").setProperty(sPath1, data[0].Valor);

              sPath1 = sPath + "/Preco2";
              this_.getView().getModel("ModelItens").setProperty(sPath1, data[0].Valor);

              sPath1 = sPath + "/UM";
              this_
                .getView()
                .getModel("ModelItens")
                .setProperty(sPath1, data[0].UnidadeMedida);
            }
          },
          function (error) {}
        );
      },

      onCancelarCotacao: function () {
        var this_ = this;
        MessageBox.confirm("Deseja realmente cancelar a ordem de venda ?", {
          title: "Informação",
          initialFocus: sap.m.MessageBox.Action.CANCEL,
          onClose: function (sButton) {
            if (sButton === MessageBox.Action.OK) {
              this_.onLimpaTela();
            }
          },
        });
      },

      onLimpaTela: function () {
        this.getView().byId("idTpCotacao").setValue("");
        this.getView().byId("idOrgVend").setValue("");
        this.getView().byId("idCanal").setValue("");
        this.getView().byId("idSetor").setValue("");
        this.getView().byId("idValidoAte").setValue("");
        this.getView().byId("idEscritorio").setValue("");
        this.getView().byId("idEmissor").setValue("");
        this.getView().byId("idPedido").setValue(""),
          this.getView().byId("idRecebedor").setValue("");
        this.getView().byId("idFormaPag").setValue("");
        this.getView().byId("idCondPag").setValue("");
        this.getView().byId("idUtilizacao").setValue("");
        this.getView().byId("idMotivo").setValue("");
        this.getView().byId("idVendedor").setValue("");
        this.getView().byId("idIncoterms1").setValue("");
        this.getView().byId("idIncoterms2").setValue(""),
          this.getView().byId("idDataPedido").setValue("");
        this.getView().byId("idFrete").setSelected(false);
        this.getView().byId("idFreteValor").setValue("");
        this.getView().byId("idBloqueio").setValue("");
        this.getView().byId("idLocal").setValue("");
        this.getView().byId("idCItens").setValue("");
        this.getView().byId("idCPeso").setValue("");
        this.getView().byId("idCIcms").setValue("");
        this.getView().byId("idCSt").setValue("");
        this.getView().byId("idCIpi").setValue("");
        this.getView().byId("idCValor").setValue("");
        this.getView().byId("idCJuros").setValue("");
        this.getView().byId("idCDescP").setValue("");
        this.getView().byId("idCDescR").setValue("");
        this.getView().byId("idCNPJ").setValue("");
        var oData = {
          Itens: [
            {
              Item: "010",
              Material: "",
              Descricao: "",
              Centro: "",
              Estoque: "",
              Qtd: "",
              UM: "",
              Preco: "",
              Preco2: "",
              DescPercentual: "",
              Desconto: "",
              ICMS: "",
              ST: "",
              IPI: "",
              Comissao: "",
              ValorItem: "",
              CurrencyCode: "BRL",
              DataConfirmada: "",
              DataDesejada: "",
              MotivoRecusaItem: "",
              Perda: "",
              PlanoCorte: "",
              RefDoc: "",
              RefItem: "",
              Caracteristica: "",
              CaracteristicaValor: "",
            },
          ],
        };

        //Iniciar a model
        var oModel = new JSONModel(oData);
        this.getView().setModel(oModel, "ModelItens");
        var oData1 = {};
        var oModel2 = new JSONModel();
        var data1 = [];
        oData1.Itens = data1;
        oModel2.setData(oData1);
        this.getView().setModel(oModel2, "textos");
        this.getView().setModel(oModel2, "textosOld");

        var dadosAdd;
        var dadosAddVet = [];

        dadosAdd = {
          Certificado: "",
          Segmento: "",
          LimiteCarga: "",
          LimiteVeiculo: "",
          Restricao1: "",
          Restricao2: "",
          Restricao3: "",
          Restricao4: "",
          Restricao5: "",
          Recebimento: "",
        };

        dadosAddVet.push(dadosAdd);

        var oModel3 = new JSONModel();
        var oData3 = {};
        oData3.Itens = dadosAddVet;
        oModel3.setData(oData3);
        this.getView().setModel(oModel3, "dadosAdicionais");

        this.limpaState();
      },

      buscaDadosCotacao: function (sCotacao, sTipo) {
        var __this = this;

        Results.buscaDadosCotacao(sCotacao, sTipo).then(
          function (data) {
            var dadosItens = [];
            var dadosAddVet = [];
            var count = 0;

            if (data[0].Mensagem !== "") {
              var mensagem = data[0].Mensagem;
              MessageBox.alert(mensagem);
            } else {
              // Frete
              var frete = false;
              if (data[0].Frete === "X") {
                frete = true;
              }

              //Campos da tela
              if (sTipo === "B") {
                __this.getView().byId("idTpCotacao").setValue("");
              } else {
                __this
                  .getView()
                  .byId("idTpCotacao")
                  .setValue(data[0].TpCotacao);
              }

              if (gRef !== "") {
                __this.buscaTipoOVPreenchimentoAutomatico(gRef);
              }

              __this.getView().byId("idOrgVend").setValue(data[0].OrgVendas);
              __this.getView().byId("idCanal").setValue(data[0].Canal);
              __this.getView().byId("idSetor").setValue(data[0].Setor);
              __this.getView().byId("idValidoAte").setValue(data[0].ValidoAte);
              __this
                .getView()
                .byId("idEscritorio")
                .setValue(data[0].Escritorio);
              __this.getView().byId("idEmissor").setValue(data[0].Emissor);
              __this.getView().byId("idPedido").setValue(data[0].Pedido),
                __this
                  .getView()
                  .byId("idRecebedor")
                  .setValue(data[0].Recebedor);
              __this.getView().byId("idFormaPag").setValue(data[0].FormaPag);
              __this.getView().byId("idCondPag").setValue(data[0].CondPag);
              __this
                .getView()
                .byId("idUtilizacao")
                .setValue(data[0].Utilizacao);
              __this.getView().byId("idMotivo").setValue(data[0].Motivo);
              __this.getView().byId("idVendedor").setValue(data[0].Vendedor);
              __this
                .getView()
                .byId("idIncoterms1")
                .setValue(data[0].Incoterms1);
              __this
                .getView()
                .byId("idIncoterms2")
                .setValue(data[0].Incoterms2),
                __this
                  .getView()
                  .byId("idDataPedido")
                  .setValue(data[0].DataPedido);
              __this
                .getView()
                .byId("idIndicaoComercial")
                .getValue(data[0].IndicacaoComercial);
              __this.getView().byId("idLocal").getValue(data[0].Local);
              __this
                .getView()
                .byId("idBloqueio")
                .getValue(data[0].BlockRemessa);
              __this.getView().byId("idFrete").setSelected(frete);
              __this.getView().byId("idFreteValor").setValue("");
              __this.getView().byId("idLocal").setValue(data[0].Local);

              //Busca Descrição dos campos

              __this.buscaModelModificar(
                __this.getView().byId("idTpCotacao"),
                "idTpCotacao",
                __this
              );
              __this.buscaModelModificar(
                __this.getView().byId("idOrgVend"),
                "idOrgVend",
                __this
              );
              __this.buscaModelModificar(
                __this.getView().byId("idCanal"),
                "idCanal",
                __this
              );
              __this.buscaModelModificar(
                __this.getView().byId("idSetor"),
                "idSetor",
                __this
              );
              __this.buscaModelModificar(
                __this.getView().byId("idEscritorio"),
                "idEscritorio",
                __this
              );
              //__this.buscaModelModificar(__this.getView().byId("idEmissor"), "idEmissor", __this);
              //__this.buscaModelModificar(__this.getView().byId("idRecebedor"), "idRecebedor", __this);
              __this.buscaModelModificar(
                __this.getView().byId("idFormaPag"),
                "idFormaPag",
                __this
              );
              __this.buscaModelModificar(
                __this.getView().byId("idUtilizacao"),
                "idUtilizacao",
                __this
              );
              __this.buscaModelModificar(
                __this.getView().byId("idMotivo"),
                "idMotivo",
                __this
              );
              //__this.buscaModelModificar(__this.getView().byId("idVendedor"), "idVendedor", __this);
              __this.buscaModelModificar(
                __this.getView().byId("idIncoterms1"),
                "idIncoterms1",
                __this
              );
              __this.buscaModelModificar(
                __this.getView().byId("idIndicaoComercial"),
                "idIndicaoComercial",
                __this
              );
              __this.buscaModelModificar(
                __this.getView().byId("idLocal"),
                "idLocal",
                __this
              );
              __this.buscaModelModificar(
                __this.getView().byId("idCondPag"),
                "idCondPag",
                __this
              );
              __this.buscaModelModificar(
                __this.getView().byId("idBloqueio"),
                "idBloqueio",
                __this
              );
              __this.buscaModelModificar(
                __this.getView().byId("idFreteValor"),
                "idFreteValor",
                __this
              );

              var sCodigo = "";
              sCodigo = data[0].Emissor;
              if (sCodigo !== "") {
                Results.buscaEmissor(sCodigo, "").then(
                  function (data1) {
                    if (data1.length === 1) {
                      __this
                        .getView()
                        .byId("idEmissor")
                        .setValue(data1[0].cod + "-" + data1[0].desc);

                      __this.getView().byId("idCNPJ").setValue(data1[0].cnpj);
                    }
                  },
                  function (error) {}
                );
              }

              sCodigo = data[0].Recebedor;
              if (sCodigo !== "") {
                Results.buscaRecebedor(sCodigo, "").then(
                  function (data1) {
                    __this
                      .getView()
                      .byId("idRecebedor")
                      .setValue(data1[0].cod + "-" + data1[0].desc);
                  },
                  function (error) {}
                );
              }

              sCodigo = data[0].Vendedor;
              if (sCodigo !== "") {
                Results.buscaVendedor(sCodigo, "").then(
                  function (data1) {
                    if (data1.length === 1) {
                      __this
                        .getView()
                        .byId("idVendedor")
                        .setValue(data1[0].cod + "-" + data1[0].desc);
                    }
                  },
                  function (error) {}
                );
              }

              __this
                .getView()
                .byId("idCDescP")
                .setValue(data[0].DescPCabecalho);
              __this
                .getView()
                .byId("idCDescR")
                .setValue(data[0].DescRCabecalho);
              __this.getView().byId("idCItens").setValue(data[0].itens);
              __this.getView().byId("idCPeso").setValue(data[0].PesoC);
              __this.getView().byId("idCIcms").setValue(data[0].IcmsC);
              __this.getView().byId("idCSt").setValue(data[0].StC);
              __this.getView().byId("idCIpi").setValue(data[0].IpiC);
              __this.getView().byId("idCValor").setValue(data[0].ValorTotal);
              __this.getView().byId("idCJuros").setValue(data[0].Juros);

              //Textos
              __this.InsereTexto("001", data[0].Observacao);
              __this.InsereTexto("003", data[0].Funcionamento);
              __this.InsereTexto("004", data[0].Entrega);
              __this.InsereTexto("005", data[0].Fiscal);

              //Dados Adicionais
              var dadosAdd = {
                Certificado: data[0].Certificado,
                Segmento: data[0].Segmento,
                LimiteCarga: data[0].LimiteCarga,
                LimiteVeiculo: data[0].LimiteVeiculo,
                Restricao1: data[0].Restricao1,
                Restricao2: data[0].Restricao2,
                Restricao3: data[0].Restricao3,
                Restricao4: data[0].Restricao4,
                Restricao5: data[0].Restricao5,
                Recebimento: data[0].Recebimento,
              };
              dadosAddVet.push(dadosAdd);

              for (var i = 0; i < data.length; i++) {
                count = count + 1;

                if (data[i].TipoDescontoItem === "PERCENTUAL") {
                  ValorDesconto = data[i].ValorDescontoItem;
                }
                if (data[i].TipoDescontoItem === "REAL") {
                  ValorDesconto1 = data[i].ValorDescontoItem;
                }

                //Itens
                var itens = {
                  Material: data[i].Material,
                  Descricao: data[i].DescricaoMaterial,
                  Item: data[i].Itens.substring(3, 6),
                  Qtd: data[i].Quantidade,
                  Centro: data[i].Centro,
                  Preco: data[i].Preco,
                  Preco2: data[i].Preco2,
                  UM: data[i].Um,
                  Estoque: data[i].Estoque,
                  //Peso: data[i].Qtd,
                  DataDesejada: data[i].DataDesejada,
                  DataConfirmada: data[i].DataConfirmada,
                  DescPercentual: data[i].DescP,
                  Desconto: data[i].DescR,
                  ICMS: data[i].IcmsI,
                  ST: data[i].StI,
                  IPI: data[i].IpiI,
                  Comissao: data[i].ComissaoI,
                  ValorItem: data[i].ValorItem,
                  Lote: data[i].Lote,
                  Logadouro: data[i].Logadouro,
                  Bairro: data[i].Bairro,
                  Cidade: data[i].Cidade,
                  Uf: data[i].Uf,
                  Cep: data[i].Cep,
                  LocalItem: data[i].LocalItem,
                  Name1: data[i].Name1,
                  MotivoRecusaItem: data[i].MotivoRecusaItem,
                  Perda: data[i].Perda,
                  RefDoc: gRef,
                  RefItem: data[i].Itens.substring(3, 6),
                  PlanoCorte: data[i].PlanoCorte,
                  Caracteristica: data[i].Caracteristica,
                  CaracteristicaValor: data[i].CaracteristicaValor,
                  //Observacao: concatenar1,
                  //Funcionamento: concatenar3,
                  //Entrega: concatenar4,
                  //Fiscal: concatenar5,
                };

                if (
                  (gRef !== "" && data[i].MotivoRecusaItem === "") ||
                  gRef === ""
                ) {
                  dadosItens.push(itens);
                }
              }

              __this.getView().byId("idCItens").setValue(count);

              //Inicia a model dos itens
              var oData = {};
              var oModel = new JSONModel();
              oData.Itens = dadosItens;
              oModel.setData(oData);
              __this.getView().setModel(oModel, "ModelItens");

              //Inicia model dados adicionais
              var oModel1 = new JSONModel();
              var oData1 = {};
              oData1.Itens = dadosAddVet;
              oModel1.setData(oData1);
              __this.getView().setModel(oModel1, "dadosAdicionais");

              __this.setaEditable(false, __this);

              __this.getView().setBusy(false);
            }
          },
          function (error) {
            __this.getView().setBusy(false);
          }
        );
      },

      InsereTexto: function (sCod, sLines) {
        var oData = {};
        var oDados = {};
        var oModel = new JSONModel();

        var data = this.getView().getModel("textos").getData().Itens;
        var dados = [];
        var splitTexto = sLines.split(";");

        for (var i = 0; i < data.length; i++) {
          dados.push(data[i]);
        }

        for (var o = 0; o < splitTexto.length; o++) {
          oDados = {
            Cod: sCod,
            Lines: splitTexto[o],
          };
          dados.push(oDados);
        }

        oData.Itens = dados;
        oModel.setData(oData);
        this.getView().setModel(oModel, "textos");
        this.getView().setModel(oModel, "textosOld");
      },

      setaEditable: function (sValue, __this) {
        if (stateView !== "CRIA") {
          //Botões
          //__this.getView().byId("idOK").setEnabled(sValue);
          __this.getView().byId("idCancelar").setEnabled(sValue);
          __this.getView().byId("idCalcular").setEnabled(sValue);
          __this.getView().byId("idEstoque").setEnabled(sValue);
          __this.getView().byId("idAdicionar").setEnabled(sValue);
          __this.getView().byId("idEliminar").setEnabled(sValue);

          //Campos da tela
          __this.getView().byId("idTpCotacao").setEditable(sValue);
          __this.getView().byId("idOrgVend").setEditable(sValue);
          __this.getView().byId("idCanal").setEditable(sValue);
          __this.getView().byId("idSetor").setEditable(sValue);
          __this.getView().byId("idValidoAte").setEditable(sValue);
          __this.getView().byId("idEscritorio").setEditable(sValue);
          __this.getView().byId("idEmissor").setEditable(sValue);
          __this.getView().byId("idPedido").setEditable(sValue);
          __this.getView().byId("idRecebedor").setEditable(sValue);
          __this.getView().byId("idFormaPag").setEditable(sValue);
          __this.getView().byId("idCondPag").setEditable(sValue);
          __this.getView().byId("idUtilizacao").setEditable(sValue);
          __this.getView().byId("idMotivo").setEditable(sValue);
          __this.getView().byId("idVendedor").setEditable(sValue);
          __this.getView().byId("idIncoterms1").setEditable(sValue);
          __this.getView().byId("idIncoterms2").setEditable(sValue);
          __this.getView().byId("idDataPedido").setEditable(sValue);
          __this.getView().byId("idIndicaoComercial").setEditable(sValue);
          __this.getView().byId("idCDescP").setEditable(sValue);
          __this.getView().byId("idCDescR").setEditable(sValue);
          __this.getView().byId("idLocal").setEditable(sValue);
          __this.getView().byId("idFrete").setEditable(sValue);
          __this.getView().byId("idFreteValor").setEditable(sValue);
          __this.getView().byId("idBloqueio").setEditable(sValue);

          var itens = __this.getView().byId("idProductsTable").getItems();

          for (var i = 0; i < itens.length; i++) {
            itens[i].getCells()[1].setEditable(sValue); //"Material"
            itens[i].getCells()[3].setEditable(sValue); //"Centro
            itens[i].getCells()[4].setEditable(sValue);
            itens[i].getCells()[5].setEditable(sValue);
            itens[i].getCells()[8].setEditable(sValue);
            itens[i].getCells()[9].setEditable(sValue);
            itens[i].getCells()[10].setEditable(sValue);
            //itens[i].getCells()[14].setEditable(sValue);
          }
        }
      },

      onModificar: function (oEvent) {
        stateView = "MODIFICA";
        var sValue = true;

        //Botões
        this.getView().byId("idCancelar").setEnabled(sValue);
        this.getView().byId("idCalcular").setEnabled(sValue);
        this.getView().byId("idEstoque").setEnabled(sValue);
        this.getView().byId("idAdicionar").setEnabled(sValue);
        this.getView().byId("idEliminar").setEnabled(sValue);

        this.getView().byId("idModificar").setEnabled(false);
        this.getView().byId("idOK").setEnabled(sValue);
        this.getView().byId("idPedido").setEditable(sValue);
        this.getView().byId("idRecebedor").setEditable(sValue);
        this.getView().byId("idFormaPag").setEditable(sValue);
        this.getView().byId("idCondPag").setEditable(sValue);
        this.getView().byId("idUtilizacao").setEditable(sValue);
        this.getView().byId("idMotivo").setEditable(sValue);
        this.getView().byId("idVendedor").setEditable(sValue);
        this.getView().byId("idBloqueio").setEditable(sValue);
        //bloqueio
        this.getView().byId("idIncoterms1").setEditable(sValue);
        this.getView().byId("idIncoterms2").setEditable(sValue);
        this.getView().byId("idDataPedido").setEditable(sValue);
        this.getView().byId("idFrete").setEditable(sValue);
        this.getView().byId("idFreteValor").setEditable(sValue);
        this.getView().byId("idIndicaoComercial").setEditable(sValue);
        this.getView().byId("idCDescP").setEditable(sValue);
        this.getView().byId("idCDescR").setEditable(sValue);
        this.getView().byId("idLocal").setEditable(sValue);

        var itens = this.getView().byId("idProductsTable").getItems();

        for (var i = 0; i < itens.length; i++) {
          if (
            itens[i]
              .getBindingContext("ModelItens")
              .getProperty("MotivoRecusaItem") !== ""
          ) {
            itens[i].getCells()[1].setEditable(false);
            itens[i].getCells()[3].setEditable(false);
            itens[i].getCells()[4].setEditable(true);
            itens[i].getCells()[5].setEditable(false);
            itens[i].getCells()[8].setEditable(false);
            itens[i].getCells()[9].setEditable(false);
            itens[i].getCells()[10].setEditable(false);
            //itens[i].getCells()[14].setEditable(false);
          } else {
            itens[i].getCells()[1].setEditable(sValue); //"Material"
            itens[i].getCells()[3].setEditable(sValue); //"Centro
            itens[i].getCells()[4].setEditable(sValue);
            itens[i].getCells()[5].setEditable(sValue);
            itens[i].getCells()[8].setEditable(sValue);
            itens[i].getCells()[9].setEditable(sValue);
            itens[i].getCells()[10].setEditable(sValue);
            //itens[i].getCells()[14].setEditable(sValue);
          }
        }

        //	Textos do cabeçalho
        //Lote
        //Data desejada
        //Data confirmada
        //Texto cli/mat item
      },

      stateDadosAdicionais: function () {
        if (stateView === "CRIA" || stateView === "MODIFICA") {
          sap.ui.getCore().byId("idCertificado").setEditable(true);
          sap.ui.getCore().byId("idSegmento").setEditable(true);
          sap.ui.getCore().byId("idLimiteCarga").setEditable(true);
          sap.ui.getCore().byId("idLimiteVeiculo").setEditable(true);
          sap.ui.getCore().byId("idRestricao1").setEditable(true);
          sap.ui.getCore().byId("idRestricao2").setEditable(true);
          sap.ui.getCore().byId("idRestricao3").setEditable(true);
          sap.ui.getCore().byId("idRestricao4").setEditable(true);
          sap.ui.getCore().byId("idRestricao5").setEditable(true);
          sap.ui.getCore().byId("idRecebimento").setEditable(true);
          sap.ui.getCore().byId("idTexto").setEditable(true);
          sap.ui.getCore().byId("idOK").setEnabled(true);

          sap.ui.getCore().byId("idLogadouro").setEditable(true);
          sap.ui.getCore().byId("idBairro").setEditable(true);
          sap.ui.getCore().byId("idCidade").setEditable(true);
          sap.ui.getCore().byId("idUF").setEditable(true);
          sap.ui.getCore().byId("idCep").setEditable(true);
          sap.ui.getCore().byId("idName").setEditable(true);

          var local = this.getView().byId("idLocal").getValue();
          //Se local estiver preenchido desabilitar local da tela de itens
          if (local === "" || local === undefined) {
            sap.ui.getCore().byId("idLogadouro").setEditable(false);
            sap.ui.getCore().byId("idBairro").setEditable(false);
            sap.ui.getCore().byId("idCidade").setEditable(false);
            sap.ui.getCore().byId("idUF").setEditable(false);
            sap.ui.getCore().byId("idCep").setEditable(false);
            sap.ui.getCore().byId("idName").setEditable(false);

            sap.ui.getCore().byId("idLogadouro").setValue("");
            sap.ui.getCore().byId("idBairro").setValue("");
            sap.ui.getCore().byId("idCidade").setValue("");
            sap.ui.getCore().byId("idUF").setValue("");
            sap.ui.getCore().byId("idCep").setValue("");
            sap.ui.getCore().byId("idName").setValue("");
          } else {
            sap.ui.getCore().byId("idLogadouro").setEditable(true);
            sap.ui.getCore().byId("idBairro").setEditable(true);
            sap.ui.getCore().byId("idCidade").setEditable(true);
            sap.ui.getCore().byId("idUF").setEditable(true);
            sap.ui.getCore().byId("idCep").setEditable(true);
            sap.ui.getCore().byId("idName").setEditable(true);
          }
        } else {
          sap.ui.getCore().byId("idCertificado").setEditable(false);
          sap.ui.getCore().byId("idSegmento").setEditable(false);
          sap.ui.getCore().byId("idLimiteCarga").setEditable(false);
          sap.ui.getCore().byId("idLimiteVeiculo").setEditable(false);
          sap.ui.getCore().byId("idRestricao1").setEditable(false);
          sap.ui.getCore().byId("idRestricao2").setEditable(false);
          sap.ui.getCore().byId("idRestricao3").setEditable(false);
          sap.ui.getCore().byId("idRestricao4").setEditable(false);
          sap.ui.getCore().byId("idRestricao5").setEditable(false);
          sap.ui.getCore().byId("idRecebimento").setEditable(false);
          sap.ui.getCore().byId("idTexto").setEditable(false);
          sap.ui.getCore().byId("idOK").setEnabled(false);

          sap.ui.getCore().byId("idLogadouro").setEditable(false);
          sap.ui.getCore().byId("idBairro").setEditable(false);
          sap.ui.getCore().byId("idCidade").setEditable(false);
          sap.ui.getCore().byId("idUF").setEditable(false);
          sap.ui.getCore().byId("idCep").setEditable(false);
          sap.ui.getCore().byId("idName").setEditable(false);
        }
      },

      stateLineItem: function () {
        if (stateView === "CRIA" || stateView === "MODIFICA") {
          sap.ui.getCore().byId("idDataDesejada").setEditable(true);
          sap.ui.getCore().byId("idPerda").setEditable(true);
          sap.ui.getCore().byId("idDataConfirmada").setEditable(true);
          sap.ui.getCore().byId("idLote").setEditable(true);
          sap.ui.getCore().byId("idLocal").setEditable(true);
          sap.ui.getCore().byId("idOkLine").setEnabled(true);
          sap.ui.getCore().byId("idMotivoRecusaItem").setEditable(true);

          var valueLocal = this.getView().byId("idLocal").getValue();
          if (valueLocal !== "") {
            sap.ui.getCore().byId("idLocal").setEditable(false);
          } else {
            sap.ui.getCore().byId("idLocal").setEditable(true);
          }
        } else {
          sap.ui.getCore().byId("idDataDesejada").setEditable(false);
          sap.ui.getCore().byId("idDataConfirmada").setEditable(false);
          sap.ui.getCore().byId("idPerda").setEditable(false);
          sap.ui.getCore().byId("idLote").setEditable(false);
          sap.ui.getCore().byId("idLocal").setEditable(false);
          sap.ui.getCore().byId("idOkLine").setEnabled(false);
          sap.ui.getCore().byId("idMotivoRecusaItem").setEditable(false);
        }
      },

      limpaItens: function (oEvent) {
        var itens = this.getView().getModel("ModelItens").getData().Itens;

        for (var i = 0; i < itens.length; i++) {
          this.getView().getModel("ModelItens").getData().Itens[i].ValorItem =
            "";
          this.getView().getModel("ModelItens").getData().Itens[i].IPI = "";
          this.getView().getModel("ModelItens").getData().Itens[i].ST = "";
          this.getView().getModel("ModelItens").getData().Itens[i].ICMS = "";
        }

        this.getView().getModel("ModelItens").refresh(true);
        this.getView().byId("idCPeso").setValue("");
        this.getView().byId("idCIcms").setValue("");
        this.getView().byId("idCSt").setValue("");
        this.getView().byId("idCValor").setValue("");
        this.getView().byId("idCJuros").setValue("");
        this.getView().byId("idCIpi").setValue("");
        gCalculate = "";
        this.getView().byId("idOK").setEnabled(false);
      },

      buscaDadosIcotermsEmissor: function (this_) {
        var iOrgVendas = this.retornaValor(
          this.getView().byId("idOrgVend").getValue()
        );
        var iCanalDist = this.retornaValor(
          this.getView().byId("idCanal").getValue()
        );
        var iSetor = this.retornaValor(
          this.getView().byId("idSetor").getValue()
        );
        var iEmissor = this.getView().byId("idEmissor").getValue();

        Results.buscaDadosEmissor(
          this.retornaValor(iEmissor),
          this.retornaValor(iOrgVendas),
          this.retornaValor(iCanalDist),
          this.retornaValor(iSetor)
        ).then(
          function (data) {
            var vLength = data.length;
            if (vLength === 1) {
              this_.getView().byId("idIncoterms1").setValue(data[0].Incoterms1);
              this_.getView().byId("idIncoterms2").setValue(data[0].Incoterms2);
              this_.getView().byId("idCondPag").setValue(data[0].CondPag);
              this_.getView().byId("idUtilizacao").setValue(data[0].Utilizacao);

              this_.buscaModel(
                this_.getView().byId("idIncoterms1"),
                "idIncoterms1"
              );
              this_.buscaModel(this_.getView().byId("idCondPag"), "idCondPag");
              this_.buscaModel(
                this_.getView().byId("idUtilizacao"),
                "idUtilizacao"
              );
            }
          },
          function (error) {}
        );
      },

      onFluxo: function () {
        if (gDocumento === "" || stateView === "CRIA") {
          return;
        }

        if (this._oDialog4) {
          this._oDialog4.destroy();
        }

        this._oDialog4 = sap.ui.xmlfragment("com.assistente.view.Fluxo", this);
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
        Results.buscaFluxoDocumento(gDocumento).then(
          function (data) {
            oData.Itens = data;
            oModel.setData(oData);
            __this._oDialog4.setModel(oModel, "ModelFluxo");
            __this.getView().setBusy(false);
            __this._oDialog4.open();
          },
          function (error) {
            __this.getView().setBusy(false);
            __this._oDialog4.open();
          }
        );
      },

      closeDialogFluxo: function () {
        this._oDialog4.close();
      },

      afterCloseFluxo: function (oEvent) {
        this._oDialog4.destroy();
      },

      limpaState: function (oEvent) {
        var sValueState = "None";

        var oView = this.getView(),
          aInputs = [
            oView.byId("idTpCotacao"),
            oView.byId("idOrgVend"),
            oView.byId("idCanal"),
            oView.byId("idEmissor"),
            oView.byId("idSetor"),
            oView.byId("idCondPag"),
            oView.byId("idIncoterms1"),
            oView.byId("idIncoterms2"),
          ],
          bValidationError = false;

        // Valida os campos da tela
        aInputs.forEach(function (oInput) {
          oInput.setValueState(sValueState);
        }, this);

        //Valida os itens da tabela
        var itens = this.getView().byId("idProductsTable").getItems();

        itens.forEach(function (oInput) {
          oInput.getCells()[1].setValueState(sValueState);
          oInput.getCells()[3].setValueState(sValueState);
          oInput.getCells()[5].setValueState(sValueState);
          oInput.getCells()[6].setValueState(sValueState);
          oInput.getCells()[8].setValueState(sValueState);
        }, this);
      },

      onEstoque: function (oEvent) {
        var valoresSelecionados =
          this.byId("idProductsTable").getSelectedContexts();
        if (valoresSelecionados.length === 0) {
          MessageBox.alert("Favor Selecionar a linha");
          return;
        }
        var sPatch = valoresSelecionados[0].sPath;
        var oSource = oEvent.getSource();
        var oModelOrig = oSource.getModel("ModelItens");
        var oRow = oModelOrig.getProperty(sPatch);

        var oCrossAppNavigator = sap.ushell.Container.getService(
          "CrossApplicationNavigation"
        );
        var hash =
          (oCrossAppNavigator &&
            oCrossAppNavigator.hrefForExternal({
              target: {
                semanticObject: "Material", // Semantic Object Name
                action: "displayStockMultipleMaterials", // Action
              },
              params: {
                Material: oRow.Material,
                Plant: oRow.Centro,
              },
            })) ||
          ""; // generate the Hash to display a Supplier
        oCrossAppNavigator.toExternal({
          target: {
            shellHash: hash,
          },
        }); // navigate to Supplier application
      },

      onMaterialConfiguravel: function (oEvent) {
        if (this._oDialog5) {
          this._oDialog5.destroy();
        }

        this._oDialog5 = sap.ui.xmlfragment("com.assistente.view.table", this);
        this.getView().addDependent(this._oDialog5);

        // toggle compact style
        jQuery.sap.syncStyleClass(
          "sapUiSizeCompact",
          this.getView(),
          this._oDialog5
        );

        this._oDialog5.setTitle("Material:");
        this._oDialog5.open();
      },

      beforeDialogDinamico: function (oEvent) {
        var modelConfig = this.buscaItensConfig();

        var oTable = sap.ui.getCore().byId("idMyTable");
        var oCell = [];
        var itensFLex = [];
        var itensFLex2 = [];
        var itensFLex3 = [];
        var flex1 = "";
        var flexbox = "";
        var flex2 = "";
        var modelName = "";
        var field = "";
        var num = 0;
        var this_ = this;

        modelConfig.forEach(function (oInput) {
          num = Number(num) + Number(1);
          field = "campo" + num;
          //Cria Inputs

          flex1 = this.criaInput(
            oInput.FieldName,
            oInput.FieldCod,
            oInput.FieldType,
            oInput.Help
          );
          itensFLex.push(flex1);

          //Cria table
          this.criaColuna(oInput.FieldName, oInput.FieldCod, oTable);
          modelName = "{ModelTable>" + field + "}";
          oCell = this.criaCel(modelName, oCell, oInput.FieldCod);

          Results.buscaCaracteristicas(oInput.FieldCod).then(function (data) {
            if (data.length >= 1) {
              var oDataCaract = {};
              var oModelSearch = new JSONModel();
              oDataCaract.Itens = data;
              oModelSearch.setData(oDataCaract);
              this_.getView().setModel(oModelSearch, oInput.FieldCod);
            }
          });
        }, this);

        if (modelConfig[0].Un === "M") {
          num = Number(num) + Number(1);
          field = "Total";
          //Cria table
          this.criaColuna("Total", "Total", oTable);
          modelName = "{ModelTable>" + field + "}";
          oCell = this.criaCel(modelName, oCell, "total");
        }

        var button = new sap.m.Button({
          id: this.getView().createId("idInserir"),
          text: "{i18n>inserir}",
        });
        button.addStyleClass("myCustomButton");

        var this_ = this;
        button.attachPress("click", function (oEvent) {
          this_.onInserir(oEvent);
        });

        var labelInserir = new sap.m.Label({
          text: "",
        });

        flexbox = new sap.m.FlexBox({
          direction: sap.m.FlexDirection.Column,
          justifyContent: sap.m.FlexJustifyContent.Center,
          alignItems: sap.m.FlexAlignItems.Center,
          items: [flex1, labelInserir, button],
          fitContainer: false,
        });

        flexbox.addStyleClass("sapUiSmallMarginBegin");
        flexbox.addStyleClass("sapUiSmallMarginTop");

        itensFLex3.push(flexbox);

        if (stateView !== "VISUALIZA") {
          button.setVisible(true);
        } else {
          button.setVisible(false);
          sap.ui.getCore().byId("idOkLine").setVisible(false);
          sap.ui.getCore().byId("idRemov").setVisible(false);
        }

        if (modelConfig[0].Un === "M") {
          //Cria campo de metragem
          flex2 = this.criaInput("Metragem Total", "Metros", "NUM","");
          itensFLex2.push(flex2);

          flex2 = this.criaInput("Total", "Total", "NUM","");
          itensFLex2.push(flex2);

          flexbox = new sap.m.FlexBox({
            direction: sap.m.FlexDirection.Row,
            justifyContent: sap.m.FlexJustifyContent.Center,
            alignItems: sap.m.FlexAlignItems.Center,
            items: [itensFLex2],
            fitContainer: false,
          });

          itensFLex3.push(flexbox);
        }

        var Pai = new sap.m.FlexBox({
          direction: sap.m.FlexDirection.Row,
          alignItems: sap.m.FlexJustifyContent.Start,
          items: [itensFLex, itensFLex3], //flexbox],
          wrap: sap.m.FlexWrap.Wrap,
        });

        this._oDialog5.addContent(Pai);

        var aColList = new sap.m.ColumnListItem("aColList", {
          cells: oCell,
        });

        oTable.bindItems("ModelTable>/Itens", aColList);
        this._oDialog5.addContent(oTable);

        //this.buscaDadosMaterialExistente();
      },

      criaInput: function (sName, sId, sInput, sSearchHelp) {
        //Label
        var input = "";
        var label = new sap.m.Label({
          text: sName,
        });

        var sHelp = true;
        var this_ = this;
        var ediTable = true;

        if (stateView === "VISUALIZA") {
          ediTable = false;
        }

        if (sSearchHelp === "") {
          sHelp = false;
        }

        if (sName === "Total") {
          input = new sap.m.Input({
            id: this.getView().createId(sId), //Use createId() for this.getView()
            editable: false,
          });
        } else {
          input = new sap.m.Input({
            id: this.getView().createId(sId), //Use createId() for this.getView()
            showValueHelp: sHelp,
            editable: ediTable,
            change: function (oEvent) {
              if (oEvent.getSource().getShowValueHelp()) {
                this_.handleCaracteristica(oEvent);
              }
            },
          });
        }

        //Input
        input.attachValueHelpRequest("click", function (oEvent) {
          this_.onSelectDialogPress(oEvent);
        });

        //FlexBox
        var flexbox = new sap.m.FlexBox({
          direction: sap.m.FlexDirection.Column,
          justifyContent: sap.m.FlexJustifyContent.SpaceAround,
          alignItems: sap.m.FlexJustifyContent.Start,
          items: [label, input],
          fitContainer: false,
        });

        flexbox.addStyleClass("sapUiSmallMarginBegin");
        flexbox.addStyleClass("sapUiSmallMarginTop");

        return flexbox;
      },

      criaColuna: function (sName, sId, oTable) {
        var oColumn = new sap.m.Column("col" + sId, {
          width: "5em",
          id: "01",
          header: new sap.m.Label({
            text: sName,
          }),
        });
        oTable.addColumn(oColumn);
      },

      criaCel: function (sName, oCell, sId) {
        var cell1 = new sap.m.Text({
          text: sName,
          //id:this.getView().createId(sId),
        });

        oCell.push(cell1);
        return oCell;
      },

      onUpdateFinished: function (oEvent) {},

      afterDialogDinamico: function (oEvent) {
        this._oDialog5.destroy();
      },

      closeDialogDinamico: function (oEvent) {
        if (this.getView().getModel("ModelTable") !== undefined) {
          this.getView().getModel("ModelTable").destroy();
        }
        this._oDialog5.close();
      },

      onInserir: function (oEvent) {
        var modelConfig = this.buscaItensConfig();
        var oTable = sap.ui.getCore().byId("idMyTable");
        var this_ = this;
        var valor = "";
        var total = "";
        var montarField = "";
        var num = 0;
        var field = "";
        var sPath = "";
        var sPathMotivo = "";
        var vFlag = "";
        var preco = 0;

        var oData1 = {
          campo1: "",
          campo2: "",
          campo3: "",
          campo4: "",
          campo5: "",
          campo6: "",
          campo7: "",
          campo8: "",
          campo9: "",
          campo10: "",
          campo11: "",
          campo12: "",
          campo13: "",
          campo14: "",
          campo15: "",
          campo16: "",
          campo17: "",
          campo18: "",
          campo19: "",
          campo20: "",
          Total: "",
          MotivoRecusaItem: "",
          eliminar: "",
          item: this.buscaUltimoItemDinamico(modelConfig[0].Material),
          preco: "",
          qtd: "",
          color: "",
        };

        var multiplica = 1;
        //Faz o calculo total
        modelConfig.forEach(function (oInput) {
          num = Number(num) + Number(1);
          field = "campo" + num;
          valor = this_.getValorSearchHelp(
            this_.getView().byId(oInput.FieldCod).getValue(),
            oInput.FieldType,
            oInput.Help
          );
          if (oInput.Multi === "X") {
            multiplica = multiplica * this.formatter.priceReverter(valor);
          }

          //Valida campos obrigatórios
          if (oInput.Aterf === "X" && valor === "") {
            MessageBox.alert("Campo: " + oInput.FieldName + " - Obrigatório");
            vFlag = "X";
          }
        }, this);

        if (vFlag === "X") {
          return;
        }

        vFlag = this.verificaMetragemTotal(multiplica);

        if (vFlag === "X") {
          return;
        }

        var oData = {
          Itens: [
            {
              campo1: "",
              campo2: "",
              campo3: "",
              campo4: "",
              campo5: "",
              campo6: "",
              campo7: "",
              campo8: "",
              campo9: "",
              campo10: "",
              campo11: "",
              campo12: "",
              campo13: "",
              campo14: "",
              campo15: "",
              campo16: "",
              campo17: "",
              campo18: "",
              campo19: "",
              campo20: "",
              Total: "",
              MotivoRecusaItem: "",
              eliminar: "",
              item: this.buscaUltimoItemDinamico(modelConfig[0].Material),
              preco: "",
              qtd: "",
              color: "",
            },
          ],
        };

        var vLength = 0;
        if (this.getView().getModel("ModelTable") === undefined) {
          let oModel = new JSONModel(oData);
          this.getView().setModel(oModel, "ModelTable");
          vLength = 0;
        } else {
          var oDataOrig = this.getView().getModel("ModelTable").getData();
          if (oDataOrig.Itens === undefined) {
            let oModel = new JSONModel(oData);
            this.getView().setModel(oModel, "ModelTable");
            vLength = 0;
          } else {
            oDataOrig.Itens.push(oData1);
            this.getView().getModel("ModelTable").setData(oDataOrig);
            vLength = this.buscaItensTabelaDinamica().length - 1;
          }
        }

        oTable = sap.ui.getCore().byId("idMyTable").getItems();

        //Verifica o estoque
        num = 0;
        modelConfig.forEach(function (oInput) {
          num = Number(num) + Number(1);
          field = "campo" + num;
          valor = this_.getValorSearchHelp(
            this_.getView().byId(oInput.FieldCod).getValue(),
            oInput.FieldType,
            oInput.Help
          );
          sPath = "/Itens/" + vLength + "/" + field;
          sPathMotivo = "/Itens/" + vLength + "/MotivoRecusaItem";

          if (modelConfig[0].Un !== "M") {
            multiplica = 0;
          }

          if (oInput.FieldType !== "NUM") {
            this_.verificaEstoqueConfig(
              oInput.FieldAtnam,
              sPath,
              valor,
              num,
              vLength,
              oTable,
              multiplica,
              sPathMotivo
            );
          } else {
            valor = this.formatter.priceC(valor);
            this_.getView().getModel("ModelTable").setProperty(sPath, valor);
          }
        }, this);

        //Coluna Total
        if (modelConfig[0].Un === "M") {
          sPath = "/Itens/" + vLength + "/Total";
          this.getView()
            .getModel("ModelTable")
            .setProperty(sPath, this.formatter.priceC(multiplica));

          total = this.byId("Total").getValue();
          if (total === "") {
            total = 0;
          }
          total = this.formatter.priceReverter(total);
          total = total + multiplica;
          this.byId("Total").setValue(this.formatter.priceC(total));
        }

        this.limpaCamposDinamicos(modelConfig);

        this_.getView().getModel("ModelTable").refresh(true);
      },

      verificaMetragemTotal: function (sMultiplica) {
        var total = 0;
        var metros = 0;
        var multiplica = this.formatter.priceReverter(sMultiplica);

        if (this.byId("Total") === undefined) {
          return "";
        }

        metros = this.byId("Metros").getValue();
        metros = this.formatter.priceReverter(metros);

        total = this.byId("Total").getValue();
        total = this.formatter.priceReverter(total);
        if (total === "") {
          total = 0;
        }

        if (metros === "") {
          metros = 0;
        }

        total = total + multiplica;
        if (total > metros) {
          MessageBox.alert("Quantidade Superior a metragem permitida");
          return "X";
        } else {
          return "";
        }
      },

      limpaCamposDinamicos: function (modelConfig) {
        modelConfig.forEach(function (oInput) {
          this.getView().byId(oInput.FieldCod).setValue("");
        }, this);
      },

      onConfigurar: function (oEvent) {
        var valoresSelecionados =
          this.byId("idProductsTable").getSelectedContexts();
        if (valoresSelecionados.length === 0) {
          MessageBox.alert("Favor Selecionar a linha");
          return;
        }
        var sPatch = valoresSelecionados[0].sPath;
        var oSource = oEvent.getSource();
        var oModelOrig = oSource.getModel("ModelItens");
        var oRow = oModelOrig.getProperty(sPatch);
        var __this = this;

        if (oRow.Material === "") {
          MessageBox.alert("Favor preencher o Material");
          return;
        }
        
        //var preco = oRow.Preco;
        
        //if (oRow.Preco2 === ""){
        //  oRow.Preco2 = preco;
        //}else{
       //   var calculo = this.formatter.priceReverter(oRow.Preco) - this.formatter.priceReverter(oRow.Preco2);
       //   if (calculo !== 0){
       //     oRow.Preco = this.formatter.priceC(calculo);
       //   }
       // }
         
        sap.ui.getCore().setModel(oRow, "ModelItemConfig");

        this.getView().setBusy(true);
        Results.buscaMaterialConfiguravel(oRow.Material).then(
          function (data) {
            if (data.length >= 1) {
              if (data[0].Mensagem !== "") {
                MessageBox.alert(data[0].Mensagem);
              } else {
                var oDataTable = {};
                oDataTable.Itens = data;
                var oModelTable = new JSONModel(oDataTable);
                __this.getView().setModel(oModelTable, "ModelConfig");
                __this.onMaterialConfiguravel();
              }
            }

            __this.getView().setBusy(false);
          },
          function (error) {
            __this.getView().setBusy(false);
          }
        );
      },

      verificaEstoqueConfig: function (
        atnam,
        patch,
        valor,
        coluna,
        linha,
        oTable,
        multiplica,
        sPathMotivo
      ) {
        var oRow = sap.ui.getCore().getModel("ModelItemConfig");
        this.getView().setBusy(true);
        var sCanal = this.getView().byId("idCanal").getValue();
        var sOrgVendas = this.getView().byId("idOrgVend").getValue();
        var sCentro = oRow.Centro;
        var sMaterial = oRow.Material;
        var sQtd = oRow.Qtd;
        var sAtnam = atnam;
        var __this = this;
        var vColuna = coluna - 1;
        var vLinha = linha;
        var vPreco = 0;
        var colunasTable = oTable[vLinha].getCells();

        if (multiplica !== 0) {
          sQtd = this.formatter.priceReverter(multiplica);
        } else {
          if (this.buscaItensTabelaDinamica()[vLinha].qtd !== "") {
            sQtd = this.formatter.priceReverter(
              this.buscaItensTabelaDinamica()[vLinha].qtd
            );
          } else {
            sQtd = this.formatter.priceReverter(oRow.Qtd);
          }
        }

        Results.verificaEstoqueMatConfig(
          sMaterial,
          valor, //sAtnam,
          sQtd,
          sCentro,
          sCanal,
          sOrgVendas
        ).then(
          function (data) {
            if (data.length >= 1) {
              if (data[0].Mensagem !== "") {
                MessageBox.alert(data[0].Mensagem);

                __this
                  .getView()
                  .getModel("ModelTable")
                  .setProperty(patch, valor);
                __this
                  .getView()
                  .getModel("ModelTable")
                  .setProperty(sPathMotivo, data[0].MotivoRecusa);

                  /*
                oTable[vLinha]
                  .getCells()
                  [vColuna].addStyleClass("textItensConfig");
*/
           
                  colunasTable.forEach(function (col) {
                    col.addStyleClass("textItensConfig");
                  }, this);

              } else {
                __this
                  .getView()
                  .getModel("ModelTable")
                  .setProperty(patch, valor);
              }

              //Atualiza preço
              if (__this.buscaItensTabelaDinamica()[vLinha].preco === "") {
                vPreco = 0;
              } else {
                vPreco = __this.buscaItensTabelaDinamica()[vLinha].preco;
              }
              __this.buscaItensTabelaDinamica()[vLinha].preco =
                parseFloat(data[0].Preco) + vPreco;
            } else {
              __this.getView().getModel("ModelTable").setProperty(patch, valor);
            }
            __this.getView().setBusy(false);
            __this.getView().getModel("ModelTable").refresh(true);
          },
          function (error) {
            __this.getView().setBusy(false);
          }
        );
      },

      onAtribuirCaracteristica: function (oEvent) {
        if (this.getView().getModel("ModelTable") === undefined) {
          MessageBox.alert("Favor inserir característica ou cancelar");
          return;
        }

        if (this.buscaItensTabelaDinamica() === undefined) {
          MessageBox.alert("Favor inserir característica ou cancelar");
          return;
        }

        if (this.getView().getModel("ModelTable").getData().Itens.length == 0) {
          MessageBox.alert("Favor inserir característica ou cancelar");
          return;
        }

        var total = "";
        var metros = "";

        if (this.byId("Total") !== undefined) {
          total = this.byId("Total").getValue();
          if (total === "") {
            total = 0;
          }
          total = this.formatter.priceReverter(total);

          var metros = this.byId("Metros").getValue();
          if (metros === "") {
            metros = 0;
          }
          metros = this.formatter.priceReverter(metros);

          if (total !== metros) {
            MessageBox.alert("Metragem total informada ainda não atendida.");
            return;
          }
        }

        var itens = this.buscaItensTabelaDinamica();
        var oRow = sap.ui.getCore().getModel("ModelItemConfig");
        var nomesCaracteristicas = this.buscaItensConfig();
        var vLengthCaracteristica = nomesCaracteristicas.length - 1;
        var oDataOrig = this.getView().getModel("ModelItens").getData();
        var count = oDataOrig.Itens.length - 1; //Buscar o Ultimo registro
        var oData = {};
        var item = "000";
        var valoresSelecionados =
          this.byId("idProductsTable").getSelectedContexts();
        var sPatch = valoresSelecionados[0].sPath;
        var flag = "X";
        var caracteristica = "";
        var caracteristicaValor = "";
        var count = 0;
        var lines = 0;
        var colunas = sap.ui
          .getCore()
          .byId("idMyTable")
          .getItems()[0]
          .getCells();
        var sPatchMotivo = sPatch + "/MotivoRecusaItem";
        var sPatchValor = sPatch + "/CaracteristicaValor";
        var valueMotivo = "";
        var valueisEnabled = true;
        var qtd = "";
        var calculoPreco = 0;

        sPatch = sPatch + "/Caracteristica";
        item = Number(oDataOrig.Itens[count].Item) + 10;

        //Limpa campo
        oDataOrig.Itens.forEach(function (oInputL) {
          if (oInputL.Material === oRow.Material) {
            oInputL.Caracteristica = "";
          }
        }, this);

        itens.forEach(function (oInput) {
          valueMotivo = "";
          valueisEnabled = true;

          if (oInput.MotivoRecusaItem !== "") {
            valueMotivo = oInput.MotivoRecusaItem;
            valueisEnabled = false;
          }

          lines = 0;
          caracteristica = "";
          colunas = sap.ui
            .getCore()
            .byId("idMyTable")
            .getItems()
            [count].getCells();

          if (this.verificaExistenciaItem(oInput.item)) {
            flag = "X";
            colunas.forEach(function (oInputColuna) {
              if (lines <= vLengthCaracteristica) {
                if (flag === "X") {
                  caracteristica = nomesCaracteristicas[lines].FieldCod;
                  caracteristicaValor = oInputColuna.getText();
                } else {
                  caracteristica =
                    caracteristica + ";" + nomesCaracteristicas[lines].FieldCod;
                  caracteristicaValor =
                    caracteristicaValor + ";" + oInputColuna.getText();
                }

                lines = lines + 1;
              }

              flag = "";
            }, this);

            qtd = this.formatter.priceC(oInput.Total);

            this.atualizaItem(
              oInput.item,
              caracteristica,
              caracteristicaValor,
              valueMotivo,
              oInput.preco,
              valueisEnabled,
              qtd
            );
            flag = "";
            //this.getView().getModel("ModelItens").setProperty(sPatch, caracteristica);
            //this.getView().getModel("ModelItens").setProperty(sPatchMotivo,oRow.MotivoRecusaItem);
            //this.getView().getModel("ModelItens").setProperty(sPatchValor, caracteristicaValor);
          } else {
            //Adiciona novas linhas no item
            flag = "X";
            lines = 0;
            colunas.forEach(function (oInputColuna) {
              if (lines <= vLengthCaracteristica) {
                if (flag === "X") {
                  caracteristica = nomesCaracteristicas[lines].FieldCod;
                  caracteristicaValor = oInputColuna.getText();
                } else {
                  caracteristica =
                    caracteristica + ";" + nomesCaracteristicas[lines].FieldCod;
                  caracteristicaValor =
                    caracteristicaValor + ";" + oInputColuna.getText();
                }

                lines = lines + 1;
              }
              flag = "";
            }, this);

            if (item.toString().length == 2) {
              item = "0" + item;
            }

            qtd = this.formatter.priceC(oInput.Total);
            calculoPreco = this.formatter.priceReverter(oRow.Preco2) + this.formatter.priceReverter(oInput.preco);

            oData = {
              Item: oInput.item,
              Material: oRow.Material,
              Descricao: oRow.Descricao,
              Centro: oRow.Centro,
              Estoque: oRow.Estoque,
              Qtd: qtd,
              UM: oRow.UM,
              Preco: this.formatter.priceC(calculoPreco),
              Preco2: oRow.Preco2,
              DescPercentual: oRow.DescPercentual,
              Desconto: oRow.TipoDescontoItem,
              ICMS: oRow.ICMS,
              ST: oRow.ST,
              IPI: oRow.IPI,
              Comissao: oRow.Comissao,
              ValorItem: oRow.ValorItem,
              CurrencyCode: oRow.CurrencyCode,
              DataConfirmada: oRow.DataConfirmada,
              DataDesejada: oRow.DataDesejada,
              MotivoRecusaItem: valueMotivo,
              isEnabled: valueisEnabled,
              Perda: oRow.Perda,
              PlanoCorte: oRow.PlanoCorte,
              Caracteristica: caracteristica,
              CaracteristicaValor: caracteristicaValor,
            };

            item = Number(item) + 10;
            oDataOrig.Itens.push(oData);

            flag = "";
          }

          count = count + 1;
        }, this);

        //Deletar Itens que foram excluidos no processo de caracteristicas
        this.eliminaRegistroTabela(oDataOrig, oRow.Material);

        if (this.getView().getModel("ModelTable") !== undefined) {
          this.getView().getModel("ModelTable").destroy();
        }

        this._oDialog5.close();
      },

      buscaItensTabelaDinamica: function () {
        if (this.getView().getModel("ModelTable") !== undefined) {
          return this.getView().getModel("ModelTable").getData().Itens;
        } else {
          return undefined;
        }
      },

      buscaItensConfig: function () {
        return this.getView().getModel("ModelConfig").getData().Itens;
      },

      buscaItens: function () {
        return this.getView().getModel("ModelItens").getData().Itens;
      },

      buscaUltimoItemDinamico: function (sMatnr) {
        var itens = this.buscaItens();
        var itensTabela = this.buscaItensTabelaDinamica();
        var vLength = 0;
        var eItem = 0;

        if (itensTabela === undefined) {
          itens = itens.filter((item) => item.Material === sMatnr);
          vLength = itens.length - 1;
          eItem = Number(itens[vLength].Item) ;
          if (eItem.toString().length == 2) {
            eItem = "0" + eItem;
          }
          return eItem;
        } else {
          vLength = itensTabela.length - 1;
          if (itensTabela.length === 0) {
            eItem = Number(0) + 10;
          } else {
            eItem = Number(itensTabela[vLength].item) + 10;
          }

          if (eItem.toString().length == 2) {
            eItem = "0" + eItem;
          }
          return eItem;
        }
      },

      verificaExistenciaItem: function (sItem) {
        var itens = this.buscaItens();
        itens = itens.filter((item) => item.Item === sItem);
        if (itens.length === 0) {
          return false;
        } else {
          return true;
        }
      },

      atualizaItem: function (
        sItem,
        sCaracteristica,
        sCaracteristicaValor,
        sMotivoRecusa,
        sPreco,
        sEnable,
        sQtd
      ) {

        var itens = this.buscaItens();
        itens = itens.filter((item) => item.Item === sItem);
        itens[0].Caracteristica = sCaracteristica;
        itens[0].CaracteristicaValor = sCaracteristicaValor;
        itens[0].MotivoRecusaItem = sMotivoRecusa;
        var calculoPreco = this.formatter.priceReverter(sPreco) + this.formatter.priceReverter(itens[0].Preco2);
        itens[0].Preco = this.formatter.priceC(calculoPreco);
        itens[0].isEnabled = sEnable;
        if (sQtd !== "") {
          itens[0].Qtd = sQtd;
        }
      },

      eliminaRegistroTabela: function (oDataOrig, sMaterial) {
        var oData = {};
        var value = oDataOrig.Itens;
        var dados = value.filter(
          (inp) => inp.Material === sMaterial && inp.Caracteristica !== ""
        );
        oData.Itens = dados;
        var oModel = new JSONModel(oData);
        this.getView().setModel(oModel, "ModelItens");

        //Atuliza a numeração dos itens
        if(stateView!=="MODIFICA"){
          var newDados = this.buscaItens();
          var item = "000";
          newDados.forEach(function (oInput) {
            item = Number(item) + 10;
            if (item.toString().length == 2) {
              item = "0" + item;
            }
            oInput.Item = item;
          }, this);
        }

        this.getView().getModel("ModelItens").refresh(true);
      },

      buscaDadosMaterialExistente: function () {
        var oData = {};
        var itens = this.getView().getModel("ModelItens").getData().Itens;
        var oRow = sap.ui.getCore().getModel("ModelItemConfig");
        var modelConfig = this.buscaItensConfig();
        var multiplica = 1;
        var oModel = "";
        var dados = [];
        var num = 0;
        var field = "";
        var flagTotal = "";
        var total = 0;
        var ArrayCaracteristica = oRow.Caracteristica.split(";");
        var ArrayCaracteristicaValor = oRow.CaracteristicaValor.split(";");
        var valueItem = oRow.Item;
        var valueLastItem = oRow.Item;
        var oTable = "";
        var qtd = 0;

        if (ArrayCaracteristicaValor[0] === "") {
          return;
        }

        oData = {
          Itens: [
            {
              campo1: "",
              campo2: "",
              campo3: "",
              campo4: "",
              campo5: "",
              campo6: "",
              campo7: "",
              campo8: "",
              campo9: "",
              campo10: "",
              campo11: "",
              campo12: "",
              campo13: "",
              campo14: "",
              campo15: "",
              campo16: "",
              campo17: "",
              campo18: "",
              campo19: "",
              campo20: "",
              Total: "",
              MotivoRecusaItem: "",
              eliminar: "",
              item: "",
              preco: "",
              qtd: "",
              color: "",
            },
          ],
        };

        oModel = new JSONModel(oData);
        this.getView().setModel(oModel, "ModelTable");
        dados = this.getView().getModel("ModelTable").getData();
        var modelSet = this.getView().getModel("ModelTable");
        var sPath = "";
        var index1 = "";
        var calculo = 0;

        itens.forEach(function (oInput, index) {
          if (oInput.Material === oRow.Material) {
            qtd = this.formatter.priceReverter(oInput.Qtd) + qtd;

            ArrayCaracteristicaValor = oInput.CaracteristicaValor.split(";");
            multiplica = 1;
            flagTotal = "";

            modelConfig.forEach(function (oInput2, index2) {
              index2 = index2 + 1;
              field = "campo" + index2;
              sPath = "/Itens/" + num + "/" + field;
              index2 = index2 - 1;

              if (oInput2.Multi === "X" && oInput2.Un === "M") {
                multiplica =
                  multiplica *
                  this.formatter.priceReverter(
                    ArrayCaracteristicaValor[index2]
                  );
                flagTotal = "X";
              }

              if (
                (oInput2.Material === oRow.Material &&
                  oInput.Item === valueItem) ||
                valueLastItem === oInput.Item
              ) {
                modelSet.setProperty(sPath, ArrayCaracteristicaValor[index2]);
                sPath = "/Itens/" + num + "/item";
                modelSet.setProperty(sPath, oInput.Item);

                sPath = "/Itens/" + num + "/MotivoRecusaItem";
                modelSet.setProperty(sPath, oInput.MotivoRecusaItem);

                sPath = "/Itens/" + num + "/qtd";
                modelSet.setProperty(sPath, oInput.Qtd);

                sPath = "/Itens/" + num + "/preco";
                calculo = this.formatter.priceReverter(oInput.Preco) - this.formatter.priceReverter(oInput.Preco2);
                modelSet.setProperty(sPath, calculo);

              } else {
                valueItem = oInput.Item;
                calculo = this.formatter.priceReverter(oInput.Preco) - this.formatter.priceReverter(oInput.Preco2);

                dados.Itens.push(
                  this.getDataLimp(
                    valueItem,
                    oInput.MotivoRecusaItem,
                    oInput.Qtd,
                    calculo
                  )
                );
                modelSet.setProperty(sPath, ArrayCaracteristicaValor[index2]);
              }

              if (oInput.MotivoRecusaItem !== "") {
                oTable = sap.ui.getCore().byId("idMyTable").getItems();
                oTable[index]
                  .getCells()
                  [index2].addStyleClass("textItensConfig");
              }
            }, this);

            //Adiciona Valor na coluna total caso houver
            if (flagTotal === "X") {
              total = this.formatter.priceReverter(total);
              if (total === "") {
                total = 0;
              }
              total = total + multiplica;
              sPath = "/Itens/" + num + "/Total";
              modelSet.setProperty(sPath, multiplica);
            }

            num = num + 1;
          }
        }, this);

        //Adiciona valor no campo total
        if (flagTotal === "X") {
          this.byId("Total").setValue(this.formatter.priceC(total));
          this.byId("Metros").setValue(qtd);
        }

        if (this.getView().getModel("ModelTable") !== undefined) {
          this.getView().getModel("ModelTable").refresh(true);
        }
      },

      getDataLimp: function (sItem, sMotivo, sQtd, sPreco) {
        var oData1 = {
          campo1: "",
          campo2: "",
          campo3: "",
          campo4: "",
          campo5: "",
          campo6: "",
          campo7: "",
          campo8: "",
          campo9: "",
          campo10: "",
          campo11: "",
          campo12: "",
          campo13: "",
          campo14: "",
          campo15: "",
          campo16: "",
          campo17: "",
          campo18: "",
          campo19: "",
          campo20: "",
          Total: "",
          MotivoRecusaItem: sMotivo,
          eliminar: "",
          item: sItem,
          preco: sPreco,
          qtd: sQtd,
          color: "",
        };

        return oData1;
      },

      onRemoveDinamico: function (oEvent) {
        var valoresSelecionados = sap.ui
          .getCore()
          .byId("idMyTable")
          .getSelectedContexts();
        if (valoresSelecionados.length === 0) {
          MessageBox.alert("Favor Selecionar a linha");
          return;
        }

        var oSource = oEvent.getSource();
        var oModelOrig = oSource.getModel("ModelTable");
        var sPatch = valoresSelecionados[0].sPath;
        var oRow = "";

        valoresSelecionados.forEach(function (oInput, index) {
          sPatch = oInput.sPath;
          oRow = oModelOrig.getProperty(sPatch);
          oRow.eliminar = "X";
        }, this);

        var total = 0;
        var dados = this.buscaItensTabelaDinamica();
        var oData = {};
        dados = dados.filter((item) => item.eliminar !== "X");
        oData.Itens = dados;
        var oModel = new JSONModel(oData);
        this.getView().setModel(oModel, "ModelTable");
        var oTable = sap.ui.getCore().byId("idMyTable").getItems();

        dados.forEach(function (oInput, index) {
          if (oInput.Total !== undefined) {
            total =
              total + parseFloat(this.formatter.priceReverter(oInput.Total));
          }

          if (oInput.MotivoRecusaItem !== "") {
            oTable[index].getCells().forEach(function (oInput2) {
              oInput2.addStyleClass("textItensConfig");
            }, this);
          }
        }, this);

        //Atualiza Total
        if (this.byId("Total") !== undefined) {
          this.byId("Total").setValue(this.formatter.priceC(total));
        }
      },

      getValorSearchHelp: function (sValor, sType, sHelp) {
        if (sType === "CHAR") {
          var Array = sValor.split("-");
          if (sHelp==="X"){
           return Array[1];
          }else{
           return Array[0];
          }
        } else {
          return sValor;
        }
      },

      handleCaracteristica: function (oEvent) {
        var value = oEvent.getParameter("value"),
          input = oEvent.getSource().getId(),
          this_ = this,
          idCaracteristica = "",
          vFlag = "",
          vLength = input.length;

        if (value === "") {
          return;
        }

        vLength = vLength - 10;
        idCaracteristica = input.substr(vLength);

        var model = this.getView().getModel(idCaracteristica).getData().Itens;
        model.forEach(function (data) {
          if (value === data.cod) {
            this_
              .getView()
              .byId(input)
              .setValue(data.cod + "-" + data.desc);
            vFlag = "X";
          }
        });

        if (vFlag === "") {
          this_.getView().byId(input).setValue("");
          this_.getView().byId(input).focus();
          MessageBox.alert("Valor não encontrado");
        }
      },

      setModelDialogCaracteristica: function (input) {
        var oData1 = {};
        var oModelSearch1 = new JSONModel();
        var data1 = [];

        var vLength = input.length;
        vLength = vLength - 10;
        var idCaracteristica = this.inputId.substr(vLength);
        
        if (isNaN(Number(idCaracteristica))){
          return;
        }
        
        var result = input.includes(idCaracteristica, 0);
        if (result) {
          this._oDialog.setModel(
            this.getView().getModel(idCaracteristica),
            "ModelSearch"
          );
        }
      },

      afterOpenDialogDinamico: function (oEvent) {
        this.buscaDadosMaterialExistente();
      },

      onBack: function (oEvent) {
        var oHistory, sPreviousHash;

        oHistory = History.getInstance();
        sPreviousHash = oHistory.getPreviousHash();

        if (sPreviousHash !== undefined) {
          window.history.go(-1);
        } else {
          this.getOwnerComponent().getRouter().navTo("master");
        }
      },

      onPagamento: function(oEvent){
        var sPath = "/PagamentoSet('" + this.gDocumento + "')";

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


    });
  }
);
