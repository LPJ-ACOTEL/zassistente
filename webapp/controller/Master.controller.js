/*global history */
sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/GroupHeaderListItem",
	"sap/ui/Device",
	"com/assistente/model/formatter"
], function(BaseController, JSONModel, History, Filter, FilterOperator, GroupHeaderListItem, Device, formatter) {
	"use strict";

	return BaseController.extend("com.assistente.controller.Master", {

		formatter: formatter,

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when the master list controller is instantiated. It sets up the event handling for the master/detail communication and other lifecycle tasks.
		 * @public
		 */
		onInit: function() {

			// Control state model
			var oList = this.byId("list"),
				oViewModel = this._createViewModel(),
				// Put down master list's original value for busy indicator delay,
				// so it can be restored later on. Busy handling on the master list is
				// taken care of by the master list itself.
				iOriginalBusyDelay = oList.getBusyIndicatorDelay();

			this._oList = oList;

			// keeps the filter and search state
			this._oListFilterState = {
				aFilter: [],
				aSearch: []
			};

			this.getView().setModel(oViewModel, "masterView");

			// Make sure, busy indication is showing immediately so there is no
			// break after the busy indication for loading the view's meta data is
			// ended (see promise 'oWhenMetadataIsLoaded' in AppController)
			oList.attachEventOnce("updateFinished", function() {
				// Restore original busy indicator delay for the list
				oViewModel.setProperty("/delay", iOriginalBusyDelay);
			});

			this.getView().addEventDelegate({
				onBeforeFirstShow: function() {
					// para não dar erro, o oListSelector esta instaciado no .component
					this.getOwnerComponent().oListSelector.setBoundMasterList(oList);
				}.bind(this)
			});

			// this.getRouter().getRoute("master").attachPatternMatched(this._onMasterMatched, this);
			this.getOwnerComponent().getRouter().getRoute("master").attachPatternMatched(this._onMasterMatched, this);

			//this.getRouter().attachBypassed(this.onBypassed, this);
			this.getOwnerComponent().getRouter().attachBypassed(this.onBypassed, this);

		},

		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */

		/**
		 * After list data is available, this handler method updates the
		 * master list counter and hides the pull to refresh control, if
		 * necessary.
		 * @param {sap.ui.base.Event} oEvent the update finished event
		 * @public
		 */
		onUpdateFinished: function(oEvent) {
			var descLoja = sap.ui.getCore().getModel("desc_loja");
			//Para acessar o componente da loja
			//Ir o Inicio.view metodo init e colocar
			//this.getView().byId("nomeLoja");
			// é o campo sId: 'application-comacotel-display-component---inicio--nomeLoja'
			//    sap.ui.getCore().byId("application-comassistente-display-component---inicio--nomeLoja").setText(descLoja);

			// var loja = this.getView.byId("nomeLoja");
			// update the master list object counter after new data is loaded
			this._updateListItemCount(oEvent.getParameter("total"));

			var mBindingParams = oEvent.getParameter("bindingParams");
			if (mBindingParams !== undefined)
				mBindingParams.sorter = [new sap.ui.model.Sorter("Id")];
		},

		/**
		 * Event handler for the master search field. Applies current
		 * filter value and triggers a new search. If the search field's
		 * 'refresh' button has been pressed, no new search is triggered
		 * and the list binding is refresh instead.
		 * @param {sap.ui.base.Event} oEvent the search event
		 * @public
		 */
		onSearch: function(oEvent) {

			if (oEvent.getParameters().refreshButtonPressed) {
				// Search field's 'refresh' button has been pressed.
				// This is visible if you select any master list item.
				// In this case no new search is triggered, we only
				// refresh the list binding.
				this.onRefresh();
				return;
			}

			var sQuery = oEvent.getParameter("query");

			if (sQuery) {
				this._oListFilterState.aSearch = [new Filter("Icone", FilterOperator.Contains, sQuery)];
			} else {
				this._oListFilterState.aSearch = [];
			}
			this._applyFilterSearch();

		},

		/**
		 * Event handler for refresh event. Keeps filter, sort
		 * and group settings and refreshes the list binding.
		 * @public
		 */
		onRefresh: function() {
			this._oList.getBinding("items").refresh();
		},

		/**
		 * Event handler for the list selection event
		 * @param {sap.ui.base.Event} oEvent the list selectionChange event
		 * @public
		 */
		onSelectionChange: function(oEvent) {

			var oItem = oEvent.getParameter("listItem") || oEvent.getSource();

			if (oItem.getBindingContext().getProperty("Id") === "01") {
				this.getOwnerComponent().getRouter().navTo("master");
			} else if (oItem.getBindingContext().getProperty("Id") === "02") {
				this.getOwnerComponent().getRouter().navTo("produtos");
				// this.getOwnerComponent().getRouter().navTo("object", {Id: "1"});
			} else if (oItem.getBindingContext().getProperty("Id") === "03") {
				this.getOwnerComponent().getRouter().navTo("clientescard");
			} else if (oItem.getBindingContext().getProperty("Id") === "04") {
				this.getOwnerComponent().getRouter().navTo("ordenscards");
			} else if (oItem.getBindingContext().getProperty("Id") === "10") {
				this.getOwnerComponent().getRouter().navTo("relatorios");
			} else if (oItem.getBindingContext().getProperty("Id") === "11") {
				this.getOwnerComponent().getRouter().navTo("financeiro");
			} else if (oItem.getBindingContext().getProperty("Id") === "12") {
				this.getOwnerComponent().getRouter().navTo("fechamentocaixa");
			} else if (oItem.getBindingContext().getProperty("Id") === "13") {
				this.getOwnerComponent().getRouter().navTo("logistica");
			}

			this.getView().byId("list").removeSelections(true);
		},

		/**
		 * Event handler for the bypassed event, which is fired when no routing pattern matched.
		 * If there was an object selected in the master list, that selection is removed.
		 * @public
		 */
		onBypassed: function() {
			this._oList.removeSelections(true);
		},

		/**
		 * Used to create GroupHeaders with non-capitalized caption.
		 * These headers are inserted into the master list to
		 * group the master list's items.
		 * @param {Object} oGroup group whose text is to be displayed
		 * @public
		 * @returns {sap.m.GroupHeaderListItem} group header with non-capitalized caption.
		 */
		createGroupHeader: function(oGroup) {
			return new GroupHeaderListItem({
				title: oGroup.text,
				upperCase: false
			});
		},

		/**
		 * Event handler for navigating back.
		 * It there is a history entry or an previous app-to-app navigation we go one step back in the browser history
		 * If not, it will navigate to the shell home
		 * @public
		 */
		onNavBack: function() {
			var oDialog = new sap.m.Dialog({
				title: "Deseja sair do Sistema? ",
				beginButton: new sap.m.Button({
					icon: "sap-icon://decline",
					press: function(oEvent) {
						oEvent.getSource().getParent().close();
					}
				}),
				endButton: new sap.m.Button({
					icon: "sap-icon://accept",
					press: function(oEvent) {
						window.close();
					}
				})
			});
			oDialog.open();
		},

		/* =========================================================== */
		/* begin: internal methods                                     */
		/* =========================================================== */

		_createViewModel: function() {

			return new JSONModel({
				isFilterBarVisible: false,
				filterBarLabel: "",
				delay: 0,
				title: this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("masterTitleCount", [0]),
				noDataText: this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("masterListNoDataText"),
				sortBy: "Icone",
				groupBy: "None"
			});
		},

		/**
		 * If the master route was hit (empty hash) we have to set
		 * the hash to to the first item in the list as soon as the
		 * listLoading is done and the first item in the list is known
		 * @private
		 */
		_onMasterMatched: function() {
			// para não dar erro, o oListSelector esta instaciado no .component
			this.getOwnerComponent().oListSelector.oWhenListLoadingIsDone.then(
				function(mParams) {
					if (mParams.list.getMode() === "None") {
						return;
					}

					var sObjectId = mParams.firstListitem.getBindingContext().getProperty("Id");
					if (sObjectId === null)
						return;

					this.getOwnerComponent().getRouter().navTo("object", {
						Id: sObjectId
					}, true);

				}.bind(this),
				function(mParams) {
					if (mParams.error) {
						return;
					}
					this.getOwnerComponent().getTargets().display("detailNoObjectsAvailable");
				}.bind(this)
			);
		},

		/**
		 * Shows the selected item on the detail page
		 * On phones a additional history entry is created
		 * @param {sap.m.ObjectListItem} oItem selected Item
		 * @private
		 */
		_showDetail: function(oItem) {
			/*
			var bReplace = !Device.system.phone;
			this.getRouter().navTo("object", {
			  objectId: oItem.getBindingContext().getProperty("Id")
			}, bReplace);
			*/
		},

		/**
		 * Sets the item count on the master list header
		 * @param {integer} iTotalItems the total number of items in the list
		 * @private
		 */
		_updateListItemCount: function(iTotalItems) {
			var sTitle;
			// only update the counter if the length is final
			if (this._oList.getBinding("items").isLengthFinal()) {
				sTitle = this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("masterTitleCount", [iTotalItems]);
				this.getView().getModel("masterView").setProperty("/title", sTitle);
			}
		},

		/**
		 * Internal helper method to apply both filter and search state together on the list binding
		 * @private
		 */
		_applyFilterSearch: function() {
			var aFilters = this._oListFilterState.aSearch.concat(this._oListFilterState.aFilter),
				oViewModel = this.getView().getModel("masterView");
			this._oList.getBinding("items").filter(aFilters, "Application");
			// changes the noDataText of the list in case there are no filter results
			if (aFilters.length !== 0) {
				oViewModel.setProperty("/noDataText", this.getResourceBundle().getText("masterListNoDataWithFilterOrSearchText"));
			} else if (this._oListFilterState.aSearch.length > 0) {
				// only reset the no data text to default when no new search was triggered
				oViewModel.setProperty("/noDataText", this.getResourceBundle().getText("masterListNoDataText"));
			}
		},

		/**
		 * Internal helper method to apply both group and sort state together on the list binding
		 * @param {sap.ui.model.Sorter[]} aSorters an array of sorters
		 * @private
		 */
		_applyGroupSort: function(aSorters) {
			this._oList.getBinding("items").sort(aSorters);
		},

		/**
		 * Internal helper method that sets the filter bar visibility property and the label's caption to be shown
		 * @param {string} sFilterBarText the selected filter value
		 * @private
		 */
		_updateFilterBar: function(sFilterBarText) {
			var oViewModel = this.getView().getModel("masterView");
			oViewModel.setProperty("/isFilterBarVisible", (this._oListFilterState.aFilter.length > 0));
			oViewModel.setProperty("/filterBarLabel", this.getResourceBundle().getText("masterFilterBarText", [sFilterBarText]));
		},

		closeapp: function(oEvent) {
			//var oCartModel = this.getView().getModel("cartProducts");
			// oCartModel.setProperty("/cartEntries", {});
			//oCartModel.setProperty("/totalPrice", "0");
			sap.m.URLHelper.redirect("/sap/public/bc/icf/logoff", false);
		}

	});

});