export class CreateUser {
  constructor(userInfo) {
    (this.fullName = `${userInfo.firstName} ${userInfo.lastName}`).toLocaleUpperCase(),
      (this.firstName = userInfo.firstName),
      (this.lastName = userInfo.lastName),
      (this.email = userInfo.email),
      (this.age = userInfo.age),
      (this.role = userInfo.role),
      (this.id = userInfo._id),
      (this.lastConnection = userInfo.lastConnection);
  }
}
