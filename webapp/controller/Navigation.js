var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");
var hash = (oCrossAppNavigator && oCrossAppNavigator.hrefForExternal({
    target: {
        semanticObject: "Policy",   // Semantic Object Name
        action: "display"           // Action
    },
    params: {
        "policynrTt": sPolicynrTt   // Parameter Key & Value
    }
})) || ""; // generate the Hash to display a Supplier
oCrossAppNavigator.toExternal({
    target: {
        shellHash: hash
    }
}); // navigate to Supplier application


// Receive

var startupParams = this.getOwnerComponent().getComponentData().startupParameters;
if ((startupParams.policynrTt && startupParams.policynrTt[0])) { // Paramter Key
    sap.ui.core.UIComponent.getRouterFor(this).navTo("object", {
        objectId: startupParams.policynrTt[0]                    // Paramter Value
    }, true);
}   
