'use strict'

const RoleUser = use('App/Models/RoleUser')
const PermissionRole = use('App/Models/PermissionRole')
const Permission = use('App/Models/Permission')
const UserToken = use('App/Models/UserToken')
const MessageCode = use('App/Libraries/MessageCode')
const Env = use('Env')
const RolePermissions = async (user) => {
  var permissionsArray = []
  const roleUser = await RoleUser.query().where('user_id',user.id).first()
  user.role_id = (roleUser) ? roleUser.role_id : ''
  const permissionRole = await PermissionRole.query().where('role_id',user.role_id).fetch()
  if (permissionRole) {
    var permissionRoleJSON = permissionRole.toJSON()
    var permissionCurentUsers = user
    for(let j = 0; j < permissionRoleJSON.length; j++){
      const permission = await Permission.query().where('id',permissionRoleJSON[j].permission_id).first()
      permissionsArray.push(permission.name) 
    }
    permissionCurentUsers.permissions = permissionsArray
    return permissionCurentUsers
  }
  return []
}

module.exports = { RolePermissions }