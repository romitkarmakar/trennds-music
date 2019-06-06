firebase.initializeApp({
    apiKey: 'AIzaSyDJmuOdl4X2zn2K9iulYZ0_XDv-iF1UWxI',
    authDomain: 'trenndsmusic.firebaseapp.com',
    projectId: 'trenndsmusic'
});

var app = new Vue({
    el: "#main",
    data: {
        name: null,
        singer: null,
        tempValue: null,
        image: null,
        urls: [],
        url: null,
        playlist: null,
        db : null,
        choices: []
    },
    mounted() {
        this.db = firebase.firestore();
        var self = this;

        this.db.collection("playlist").get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                console.log(`${doc.id} => ${doc.data()['name']}`);
                self.choices.push({
                    id: doc.id,
                    name: doc.data()['name']
                });
            });
        });
    },
    methods: {
        transform() {
            this.url = this.urls.join();
        },
        validate() {
            if(this.name != null && this.singer != null && this.urls.length != 0 && this.playlist != null) return true;
            return false;
        },
        send() {
            if(!this.validate()) return;

            this.transform();

            var self = this;
            this.db.collection("music").add({
                name: self.name,
                singer: self.singer,
                url: self.url,
                image: self.image,
                playlist: self.playlist
            })
                .then(function (docRef) {
                    Swal.fire(
                        'Good job!',
                        'Your video has been uploaded',
                        'success'
                      )
                })
                .catch(function (error) {
                    alert("Error adding document: ", error);
                });
        },
        add() {
            var self = this;
            this.urls.push(self.tempValue);
            this.tempValue = "";

            $.getJSON("transform?url=" + self.urls[0]).then(function(data) {
                self.name = data.title;
                self.singer = data.owner;
                self.image = data.image;
            });
        },
        deleteUrl(index) {
            this.urls.splice(index, 1);
        }
    }
})

var appPlayList = new Vue({
    el: "#mainPlayList",
    data: {
        name: null,
        playlists: [],
        db : null,
    },
    mounted() {
        this.db = firebase.firestore();
    },
    methods: {
        validate() {
            if(this.name == null) return false;
            return true;
        },
        send() {
            if(!this.validate()) return;

            var self = this;
            this.db.collection("playlist").add({
                name: self.name,
            })
                .then(function (docRef) {
                    alert("Document written with ID: ", docRef.id);
                })
                .catch(function (error) {
                    alert("Error adding document: ", error);
                });
        },
        get() {
            var self = this;

            this.db.collection("playlist").get().then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    console.log(`${doc.id} => ${doc.data()['name']}`);
                    self.playlists.push(doc.data()['name']);
                });
            });
        }
    }
})