<!-- This Aura Application extends the "ltng:outApp" base Lightning Out application -->
<!-- "access" attribute set to "GLOBAL" allows access to this application from any Salesforce organization -->
<!-- "implements" attribute set to "ltng:allowGuestAccess" enables guest access to this application -->
<aura:application extends="ltng:outApp" access="GLOBAL" implements="ltng:allowGuestAccess">
<!-- This dependency ensures that the "c:registrationForm" component is included in this application -->
<aura:dependency resource="c:registrationForm" />
</aura:application>