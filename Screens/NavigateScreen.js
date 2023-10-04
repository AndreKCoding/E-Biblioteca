import React, {Component} from "react";
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, Image, TextInput, KeyboardAvoidingView, ToastAndroid } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner"
//import db from "../config"

const bgImage = require("../assets/background2.png");
const appIcon = require("../assets/appIcon.png");
const appName = require("../assets/appName.png");

export default class NavigateScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bookId:"",
            studentId: "",
            domState: "normal",
            hasCameraPermitions: null,
            scanned: false,
            scannedData: ""
        }
    }

    getCameraPermitions = async domState => {
        const{status} = await BarCodeScanner.requestPermissionsAsync();

        this.setState({
            hasCameraPermitions: status === "granted",
            domState: domState,
            scanned: false,
            scannedData:"",
        });
    };

    handleBarCodeScanned = async ({type, data}) => {
        const{domState} = this.state;
        if(domState === "bookId") {
            this.setState ({
                bookId: data,
                domState: "normal",
                scanned: true
            })
        } else if (domState === "studentId") {
            this.setState ({
                studentId: data,
                domState: "normal",
                scanned: true
            });
        }
    };

    handleTransition = async() => {
        var {bookId} = this.state;
        await this.getBookDetails(bookId);
        await this.getStudentDetails(studentId)
        db.collection("Livros").doc(IdLivro).get().then(
            doc => {
                var book = doc.data();
                if (book.Disponibilidade) {
                    this.initiateBookIssue();
                } else {
                    this.initiateBookReturn();
                }
            }
        );
    };

    initiateBookIssue = async (IdLivro, IdAluno, NomeLivro, Nome) => {
        console.log("Livro Retirado");
        db.collection("Transações").add({
            IdAluno: studentId,
            Nome: Nome,
            IdLivvro: bookId,
            NomeLivro: NomeLivro,
            date: firebase.firestore.Timestamp.now().toDate(),
            TipoTransação: "issue"
        });
        db.collection("Livros").doc(bookId).update({
            Disponibilidade: false
        });

        db.collection("Estudantes").doc(studentId).update({
            LivroEmprestados: firebase.firestore.FieldValue.increment(1)
        });
        this.setState({
            bookId: "",
            studentId: ""
        });
    };

    initiateBookReturn = () => {
        console.log("Livro Retornado");
        db.collection("Transações").add({
            IdAluno: studentId,
            Nome: Nome,
            IdLivvro: bookId,
            NomeLivro: NomeLivro,
            date: firebase.firestore.Timestamp.now().toDate(),
            TipoTransação: "return"
        });
        db.collection("Livros").doc(bookId).update({
            Disponibilidade: true
        });

        db.collection("Estudantes").doc(studentId).update({
            LivroEmprestados: firebase.firestore.FieldValue.increment(-1)
        });
    };

    getBookDetails = bookId => {
        bookId = bookId.trim();
        db.collection("Livros").where("IdLivro", "==", bookId)
        .get()
        .then(snapshot => {
            snapshot.docs.map(doc => {
                this.setState({
                    NomeLivro: doc.data().book_detils.book_name
                })
            })
        })
    }

    getStudentDetails = studentId => {
        studentId = studentId.trim();
        db.collection("Estudantes").where("IdAluno", "==", studentId)
        .get()
        .then(snapshot => {
            snapshot.docs.map(doc => {
                this.setState({
                    Nome: doc.data().details_detils.student_name
                })
            })
        })
    }

    render() {
        const {bookId, studentId, domState, scanned } = this.state;
        if (domState !== "normal") {
            return (
                <BarCodeScanner
                    onBarCodeScanned={scanned ? undefined : this.handleBarCodeScanned}
                />
            );
        }

        return (

            <KeyboardAvoidingView behavior="padding" style = {styles.view}>
                <ImageBackground source={bgImage} style = {styles.imageBackground}>
                    <View style = {styles.viewImg}>

                        <Image source={appIcon} style = {styles.appIcon}/>
                        <Image source={appName} style = {styles.appName}/>
                    </View>

                    <View style = {styles.viewIds}>
                        <View>
                            <TextInput style = {styles.input}
                                placeholder={"Id Livro"}
                                placeholderTextColor={"grey"}
                                value={bookId}
                                onChangeText={text => this.setState({bookId:text})}
                            />
                            <TouchableOpacity style = {styles.button} onPress={() => 
                                this.getCameraPermitions("bookId")}>
                                    <Text style = {styles.buttonText}>Digitalizar QR Code</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style = {styles.viewIds}>
                        <View>
                            <TextInput style = {styles.input}
                                placeholder={"Id Aluno"}
                                placeholderTextColor={"grey"}
                                value={studentId}
                                onChangeText={text => this.setState({studentId:text})}
                            />
                            <TouchableOpacity style = {styles.button} onPress={() => 
                                this.getCameraPermitions("studentId")}>
                                    <Text style = {styles.buttonText}>Digitalizar QR Code</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={this.handleTransition} style = {styles.sendButton}>
                                <Text style = {styles.buttonText}>Enviar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ImageBackground>
            </KeyboardAvoidingView>
        )
    }
}

const styles = StyleSheet.create({
    view: {
        justifyContent: 'center',
        alignItems: 'center',
        flex:1
    },

    button: {
        backgroundColor: '#63f289',
        width: '43%',
        height: 55,
        borderRadius: 15,
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        
    },
    buttonText: {
        fontSize: 20,
    },
    imageBackground: {
        flex: 1,
        justifyContent: "center",
        resizeMode: "cover",
        width: "100%"
    },
    viewImg: {
        flex: 0.5,
        justifyContent: "center",
        alignItems: "center"
    },
    input: {
        borderColor: 'black',
        borderWidth: 2,
        borderRadius: 20,
        width: "500px",
        textAlign: "center",
        backgroundColor: "white",
        marginBottom: 5
    },
    appIcon: {
        width: 150,
        height: 150,
        resizeMode: "contain"
    },
    appName: {
        width: 180,
        height: 50,
        resizeMode: "contain",
    },
    button: {
        width: 200,
        backgroundColor: 'green',
        textAlign: "center",
        borderColor: 'black',
        borderWidth: 2,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: 'center',
        marginLeft: 150,
        marginBottom: 5
    },
    viewIds: {
        flex: 0.2,
        justifyContent: "center",
        alignItems: 'center',
    },
    sendButton: {
        with: '35%',
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F48D20",
        borderRadius: 15,
        marginTop: 25,
        height: 55
    }
})