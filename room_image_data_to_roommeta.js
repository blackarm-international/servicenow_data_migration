var oldData = {};
var gr = new GlideRecord('u_dcse_room_visualisation_room_data');
gr.query();
while (gr.next()) {
  oldData[gr.getValue('u_room_name')] = {
    imageWithRacks: gr.getValue('u_image_with_racks'),
    imageWithoutRacks: gr.getValue('u_image_name'),
    imageHeight: gr.getValue('u_image_height'),
    imageWidth: gr.getValue('u_image_width'),
  };
}
Object.keys(oldData).forEach(function (roomName) {
  var grMeta = new GlideRecord('u_dc_room_metadata');
  grMeta.addQuery('u_room.name', roomName);
  grMeta.query();
  while (grMeta.next()) {
    grMeta.u_image_with_racks = oldData[roomName].imageWithRacks;
    grMeta.u_image_without_racks = oldData[roomName].imageWithoutRacks;
    grMeta.u_image_height = oldData[roomName].imageHeight;
    grMeta.u_image_width = oldData[roomName].imageWidth;
    grMeta.update();
  }
});
