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
        console.log(json);
        var data = JSON.parse(json); // Parsing the json string.
        
        this.id = data.id;
        this.email = data.email;
        this.username = data.username;
        this.first_name = data.first_name;
        this.last_name = data.last_name;
        this.is_superuser = data.is_superuser;
    }
}

export default User;