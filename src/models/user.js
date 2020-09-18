export class User {
    constructor(id, username, first_name, last_name, email, is_superuser) {
        this.id = id;
        this.email = email;
        this.username = username;
        this.first_name = first_name;
        this.last_name = last_name;
        this.is_superuser = is_superuser;
    };

    serialize() {
        return JSON.stringify({
            id: this.id,
            username: this.username,
            first_name: this.first_name,
            last_name: this.last_name,
            email: this.email,
            is_superuser: this.is_superuser
        });
    }

    deserialize(json) {
        
        const obj = JSON.parse(json);
        var user = new User(obj.id , obj.username , obj.first_name , obj.last_name , obj.email , obj.is_superuser);

        return user;
    }
}

export default User;