
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";

import {
    getFirestore,
    collection,
    addDoc,
    serverTimestamp,
    onSnapshot,
    query,
    orderBy,
    setDoc,
    doc,
    getDoc,
    updateDoc,
} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js";

// 日時をいい感じの形式にする関数
function convertTimestampToDatetime(timestamp) {
    const _d = timestamp ? new Date(timestamp * 1000) : new Date();
    const Y = _d.getFullYear();
    const m = (_d.getMonth() + 1).toString().padStart(2, '0');
    const d = _d.getDate().toString().padStart(2, '0');
    const H = _d.getHours().toString().padStart(2, '0');
    const i = _d.getMinutes().toString().padStart(2, '0');
    const s = _d.getSeconds().toString().padStart(2, '0');
    return `${Y}/${m}/${d} ${H}:${i}:${s}`;
}



// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

// $('#heart_send_button').on("click", function () {
//     location.href = '/html/main.html'
// })



$('#heart_send_button').on('click', function () {
    //オブジェクト形式にする
    const postData = {
        gain_of_heart: $('#gain_of_heart').val(),
        time: serverTimestamp(),
    };

    //ドキュメントIDを指定して、更新する形をとった
    const docRef = doc(db, "my_heart_gain", "3hNzf3PYApExb3RaZpgO");
    updateDoc(docRef, postData);

    //どこになにをおくるのか
    // addDoc(collection(db, "my_heart_gain"), postData);
    $('#gain_of_heart').val('');
    my_heart_get_gain()
})

async function my_heart_get_gain() {
    //総合ハートの取得する
    //マイハートのドキュメントを指定して、取得する（getdoc）
    const docRe = doc(db, "my_heart", "2tsujCrhJSttVgNMp1pC");
    const docSnap = await getDoc(docRe);
    let C_heart = docSnap.data()
    let Comprehensive_heart = C_heart.number_of_heart
    let Comprehensive_heart_number = Number(Comprehensive_heart)
    console.log(Comprehensive_heart_number)


    //送るハートを取得する
    //my_heart_decreaseのドキュメントを指定して、取得する（getdoc）
    const gain_c = doc(db, "my_heart_gain", "3hNzf3PYApExb3RaZpgO");
    const docgain = await getDoc(gain_c);
    let gain_haert = docgain.data()
    let gain_of_heart = gain_haert.gain_of_heart
    let gain_of_heart_number = Number(gain_of_heart)
    console.log(gain_of_heart_number)


    //総合ハート - 使用するハートを表現する
    let Comprehensive_heart_number_v2 = Comprehensive_heart_number + gain_of_heart_number
    console.log(Comprehensive_heart_number_v2)

    const my_heart_doc = doc(db, "my_heart", "2tsujCrhJSttVgNMp1pC");
    const new_data = {
        number_of_heart: Comprehensive_heart_number_v2,
        time: serverTimestamp(),
    };

    updateDoc(my_heart_doc, new_data);
}



//ハートの本体を表示
const q = query(collection(db, "my_heart"), orderBy('time', 'asc'))
onSnapshot(q, (querySnapshot) => {

    //入れる配列準備
    const C_documents = []

    //回して配列にいれる、使える状態にする
    querySnapshot.docs.forEach(function (doc) {
        const C_document = {
            id: doc.id,
            data: doc.data(),
        };
        C_documents.push(C_document);
    })

    //画面を表示するために配列に入れる
    //時間系列の関数をいれてあげる
    const C_htmlElements = [];
    C_documents.forEach(function (mh) {
        C_htmlElements.push(`
  
            ${mh.data.number_of_heart}
    
             `);
    });

    //配列の一番新しいものを引き抜く
    const Comprehensive_number = C_htmlElements.slice(-1)[0]
    var cm = Number(Comprehensive_number)
    $("#output").html(cm)
    console.log("総計ハート", cm)
});





//一覧画面に移動する
$('#move').on("click", function () {
    location.href = '/html/main.html'
})