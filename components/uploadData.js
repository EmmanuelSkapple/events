SubirDato=async(direccion,firebaseStorage,archivo,selfglobal)=>{
const response = await fetch(archivo);
const fileBlob = await response.blob();
console.log("en el blob");
console.log(fileBlob);
var downloadURL;
const ref=firebaseStorage.ref(direccion);
const task=ref.put(fileBlob);
var self=this;
var promise = new Promise(
        function(resolve,reject){
            task.on('state_changed',function(snapshot){
              var progress =  (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              selfglobal.setState({
                Progreso:progress,
                isModalVisible:true,
              })
              console.log('upload progress is: ' + progress);
            },(error) =>{
              alert(error);
            },()=>{
              task.snapshot.ref.getDownloadURL().then(function(dURL) {
                resolve(downloadURL= dURL);
                selfglobal.setState({
                    Terminado:true,
                })

              });

            })
        })
        return promise;
}


exports.SubirDato=SubirDato;
