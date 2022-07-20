'use strict'

class ViewPath
{
  static render(pathView , data){
    const path = require('path')
    const view = require('edge.js')
    view.registerViews(path.join(__dirname, '../src/views'))
    return view.render(pathView , data)
  }
}

module.exports = ViewPath
