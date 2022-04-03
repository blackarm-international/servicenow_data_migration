var rackSysIdArray = [];
var rackSysIdZoneSysId = {};
var zoneSysIdArray = [];
var zoneSysIdRoomSysId = {};
// get rack meta where the zone or room needs filling
var gr = new GlideRecord('u_dc_rack_metadata');
gr.addEncodedQuery('u_zoneISEMPTY^ORu_roomISEMPTY');
// gr.setLimit(1);
gr.query();
while (gr.next()) {
  rackSysIdArray.push(gr.getValue('u_rack'));
}
if (rackSysIdArray.length > 0) {
  // gets zones
  var grZone = new GlideRecord('cmdb_rel_ci');
  grZone.addQuery('child', 'IN', rackSysIdArray);
  grZone.addQuery('type', 'e7f235380a0a0aa7000e410d8c6a9a54');
  grZone.query();
  while (grZone.next()) {
    rackSysIdZoneSysId[grZone.getValue('child')] = grZone.getValue('parent');
    zoneSysIdArray.push(grZone.getValue('parent'));
  }
}
if (zoneSysIdArray.length > 0) {
  // get rooms
  var grRoom = new GlideRecord('cmdb_rel_ci');
  grRoom.addQuery('child', 'IN', zoneSysIdArray);
  grRoom.addQuery('type', 'e81e87c30a0a0aa7002dd03d09af0f6a');
  grRoom.query();
  while (grRoom.next()) {
    zoneSysIdRoomSysId[grRoom.getValue('child')] = grRoom.getValue('parent');
  }
}
var zoneSysId;
var roomSysId;
var dcSysId;
var worthUpdating;
rackSysIdArray.forEach(function (rackSysId) {
  zoneSysId = '';
  roomSysId = '';
  worthUpdating = false;
  if (rackSysId !== '') {
    // check if a zonea was found for this rack
    if (Object.prototype.hasOwnProperty.call(rackSysIdZoneSysId, rackSysId)) {
      zoneSysId = rackSysIdZoneSysId[rackSysId];
      worthUpdating = true;
    }
  }
  if (zoneSysId !== ''){
    // check if a room was found for this zone
    if (Object.prototype.hasOwnProperty.call(zoneSysIdRoomSysId, zoneSysId)) {
      roomSysId = zoneSysIdRoomSysId[zoneSysId];
      worthUpdating = true;
    }
  }
  // only update if zone/room was found
  if (worthUpdating) {
    var grUpdate = new GlideRecord('u_dc_rack_metadata');
    grUpdate.addQuery('u_rack', rackSysId);
    grUpdate.query();
    while (grUpdate.next()) {
      grUpdate.u_zone = zoneSysId;
      grUpdate.u_room = roomSysId;
      grUpdate.update();
    }
  }
});
