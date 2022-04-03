var rackSysidRackUnits = {};
var gr = new GlideRecord('cmdb_ci_rack');
gr.query();
while (gr.next()) {
  rackSysidRackUnits[gr.getValue('name')] = gr.getValue('rack_units');
}
gs.print(rackSysidRackUnits);

Object.keys(rackSysidRackUnits).forEach(function(rackName) {
  var grMeta = new GlideRecord('u_dc_rack_metadata');
  grMeta.addQuery('u_rack.name', rackName);
  grMeta.query();
  while (grMeta.next()) {
    grMeta.u_rack_units = rackSysidRackUnits[rackName];
    grMeta.update();
  }
});
