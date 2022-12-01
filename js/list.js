
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

    //どこになにをおくるのか
    addDoc(collection(db, "my_heart_gain"), postData);
    $('#gain_of_heart').val('');
})

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
    $("#output").html(cm);

    //htmlの文字を取得する
    const kari = $('#output').text();
    var shi_N = Number(kari)
    console.log("マイハートの総計", shi_N)
    // ga(shi_N)
});

//ハートがプラスになるを表示
function ga(hoge) {
    const q_mhd = query(collection(db, "my_heart_gain"), orderBy('time', 'asc'))

    onSnapshot(q_mhd, (querySnapshot) => {


        //入れる配列準備
        const documents = []

        //回して配列にいれる、使える状態にする
        querySnapshot.docs.forEach(function (doc) {
            const document = {
                id: doc.id,
                data: doc.data(),
            };
            documents.push(document);
        })


        //画面を表示するために配列に入れる
        //時間系列の関数をいれてあげる
        const htmlElements = [];
        documents.forEach(function (document) {
            htmlElements.push(`
  
            ${document.data.gain_of_heart}
    
             `);
        });

        //配列の一番新しいものを引き抜く
        const shin = htmlElements.slice(-1)[0]
        //aaaは入力された数値
        var aaa = Number(shin)
        console.log("aaa", aaa)
        //fgnは総ハート数ひく入力された数  つまり次の総ハート
        var fgn = hoge + aaa
        console.log(fgn)
        $('#clickcount').text(fgn)

    });


}