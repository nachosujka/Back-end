export class UserResponseDto {
  constructor(user) {
    this.fisrt_name = user.fisrt_name;
    this.last_name = user.last_name;
    this.email = user.email;
    this.cart = user.cart;
    this.age = user.age;
    this.role = user.role;
    this.full_name = `${user.fisrt_name} ${user.last_name}`;
  }
}
