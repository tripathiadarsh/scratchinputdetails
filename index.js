(function() {
    'use strict';
    const express = require('express');
    const app = express();
    var fs = require('fs');
    const Fingerprint = require('express-fingerprint');
    const bodyParser = require('body-parser');
    var request = require('request');
    app.engine('html', require('ejs').renderFile);
    app.set('views', __dirname + '/public');
    app.set('view engine', 'ejs');
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: !0 }));
    app.use(express.static(__dirname + '/public'));
    var firebase = require('firebase');
    const admin = require('firebase-admin');
    admin.initializeApp({
        credential: admin.credential.cert({
            "type": "service_account",
            "project_id": "scratch-card-7cde2",
            "private_key_id": "03a9a1e7a91484375ee672798a7bba0288139de5",
            "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDAF37bjFCgamtF\nWsTasfFB3vOzFzPys1jgbA6/3d8zXDphfetBBx77HFenob8cJD3yiZpym5VIcg7c\nOvdDllCUX2knwc42SVanuzDHQIqSacldxcKW+CIEHcdIHptXbL5HoBOwdf89+DYI\nL8MApORTItuXDWW8AcGCZU7mSzd1RrwV6Adx3F12y7PWpm9PevJaLLnl0GAmn99O\nyjw0zOiQzVlAGBo+XI6fal+ux0zC5YTODsplHl+fcqv1XkN6+6lA/QBVYzbkJHLq\nwEtYVWAMxCL5dpRwQo1KUB4dQJ8+ZdUs9xLz9zzUoBdoU0jgJ3ESZ0c6iP7hKYJp\nTisywRG/AgMBAAECggEAH2fX/uzRGSESWmZNjVSOwA5uY+c/wDGars/L64pKszrO\nyrYLxU0flL5HWyoCilx8ik+oDOPWA4sDq0sIC9NNZ6y1Dwx3JVYBO8QgOftvNyKM\n4G7JnTrX/jn2JRrn7+JgtmomvfDUzcdr4hPDpd0k/VioyT37VkJ9O6Sfl976pArR\nlF6byd2B2cUvYfJqNatcHL5bWEXFFga0k+OsekSXeo5bRL3nWYqDwocbIrHswXAS\nl8VWPM5e7ZQYg/0sPfk+ZbtQwhIYE67zWXT/KTh07WcZeO3xphK/H6ed2i7jQ0Sf\noax6UJFBkz4/Nm3rDGJXjf4RQ/n8q9+YateXVEFE4QKBgQD8vorX9byB4MgWFYAA\n5ODhG7wxP0Xy9/ufxJ3fHPz7/YuqZOjRoMAx51BXe4fc50BN+TfovAaykYVKFfGu\nQla3EmTPDUsk7G0RgzjJU2/wSBtcGq/LLV+WAE1RgJTtOgDj1efp72LVZyVU05Sm\nL5kIn5IKeDbx5UnSSQLHMuTLYQKBgQDCkPGIJSdxPE5tPxIEB+HG23mnjETDs021\nX5VlhDFxHPmCV8QY88TcLruzuvs+/W3OwdKsG16uhmUMNaRt3hHVW1TVOmAiG6xd\njVGBQeHMJ4YyLEjWSDWFPQ07Y3mmkbHp3+keyn4HlZ9eKo6Z16V6MD0eOVEt2c8n\n2dw/lmsRHwKBgQDwY1Zxc0N5EE+eWZKmxwpwcM281V51apGD8yDovYyNLCkzxsh9\n4XQLwuNyYYbmf3h08S3RCU0heDEbNuXohSYu96q0GAO5ubk/J9zR968HDb4gCy3a\nhGxeoijn9PEw9LM2ABSVNt98857ZIGhI7AqU3hisJoyz5A4jmNewmOJt4QKBgGc7\n6rvXIt9lJSO4BEIZQIV3rEvnFBFWUNP8fFNZ2bXvrr+m+8hVh01gin1pp6ebZij/\nFF33Q7yMWI8q4yzcWFABXrioeZt/XWxh8C4KG9lr2ztB3f+8XpFsfFnXhROJWIIE\nKTgKLuatT9rx76nXDtkPQU6JEPaoC89UPBWNJQ/3AoGBAJtKBXYjxUB8TZv/OOHz\no9atViq0zO66E3BDbG/+7ersdff22RHYyYecOCzKZ5s/26Hzynbu+edVWS99/1FE\nReAgkRdRZsXWcJoQf0feUZJbDAZjzoQ9c8TR+gtH0bPhXnOe2B8LfQTNTJXPeQvH\ntwelDIcKNHIqbukFvS6MEWyZ\n-----END PRIVATE KEY-----\n",
            "client_email": "firebase-adminsdk-o5w3u@scratch-card-7cde2.iam.gserviceaccount.com",
            "client_id": "109488691091383697384",
            "auth_uri": "https://accounts.google.com/o/oauth2/auth",
            "token_uri": "https://oauth2.googleapis.com/token",
            "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
            "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-o5w3u%40scratch-card-7cde2.iam.gserviceaccount.com"
          })
    });

    app.get('/validate', (req,response)=>{
        var number = req.query.number;
        var json = req.query.json || 0;
        var outputList = [];
        var promise = new Promise((resolve, reject) => {
            return db.collection('cardDetail').where('number', '==', number).get().then(snapshot => {
                if (snapshot.empty) {
                    console.log('No matching documents.');
                }
                snapshot.forEach(doc => {
                    let item = {};
                    item['id'] = doc.id;
                    item['quiz'] = doc.data();
                    outputList.push(item);
                });
                resolve(outputList);
            }).catch(err => {
                reject(err);
            });
        });

        promise.then(() => {
            if (json == 1) {
                response.send({
                    data: outputList
                })
            } else {
                response.render('pages/pages-one', {
                    data: outputList
                });
            }
        });

    });
    // app.post('/page-one', function(req, res) {
    //     res.render('pages/pages-one.ejs');
    // });

    app.get('/', function(req, res) {
        res.render('index.ejs');
    });
  


   
// port routing start
const PORT = process.env.PORT || 2000;
app.listen(PORT, () => {
console.log(`App listening on port ${PORT}`);
console.log('Press Ctrl+C to quit.')
});
// port routing end
})();