var oldData = {};
var gr = new GlideRecord('u_dcse_room_visualisation_rack_data');
// gr.setLimit(10);
gr.query();
while (gr.next()) {
  oldData[gr.getValue('u_rack_name')] = {
    pixelLeft: gr.getValue('u_pixel_x'),
    pixelHeight: gr.getValue('u_pixel_height'),
    pixelTop: gr.getValue('u_pixel_y'),
    pixelWidth: gr.getValue('u_pixel_width')
  }
}
Object.keys(oldData).forEach(function(rackName) {
  var grFix = new GlideRecord('u_dc_rack_metadata');
  grFix.addQuery('u_rack.name', rackName);
  grFix.query();
  while (grFix.next()) {
    grFix.u_pixel_height = oldData[rackName].pixelHeight;
    grFix.u_pixel_left = oldData[rackName].pixelLeft;
    grFix.u_pixel_top = oldData[rackName].pixelTop;
    grFix.u_pixel_width = oldData[rackName].pixelWidth;
    grFix.update();
  }
})


