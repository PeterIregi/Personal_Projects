package main

import (
	"fmt"
	"net"
	//"time"
	"bufio"
	"strings"
)

type Client struct{
	name string
	conn net.Conn
}

var(
	messages = make(chan string) //all messages go here
	joins = make(chan Client) //new clients
	leaves = make(chan Client)  //leaving clients
)

func main(){
	//listens on port 8989
	listener, _ := net.Listen("tcp", ":8989")
	//do this after runing all other commands under it
	defer listener.Close()
	fmt.Println("Chat server started on :8989")
	//closes the listner
	go broadcaster()

	for {
		conn, _ := listener.Accept()
		go handleClient(conn)
	}

	

}


func broadcaster(){
	clients := make(map[Client]bool) //track clients
	

	for {
		select{
		case msg := <- messages:
			//send to all clients
			for client := range clients{
				client.conn.Write([]byte(msg+"\n"))
			}
		case client := <-joins:
			clients[client]=true
			//Announce join
			msg := fmt.Sprintf("%s joined the chat", client.name)
			messages <- msg
		
		case client := <- leaves:
			delete(clients,client)
			msg := fmt.Sprintf("%s left the chat", client.name)
			messages <- msg
		}
	}
}

func handleClient(conn net.Conn){
	defer conn.Close()
	//send welcome message
	conn.Write([]byte("Welcome To TCP_Chat"))
	conn.Write([]byte("[ENTER YOUR NAME]: "))



	//create buffered reader
	reader := bufio.NewReader(conn)

	//read name
	name, err := reader.ReadString('\n')
	if err != nil{
		return
	}
	name=strings.TrimSpace(name)
	//client := Client{name: name, conn: conn}

	if name == ""{
		conn.Write([]byte("Name cannot be empty\n"))
		return
	}
	

	fmt.Printf("User %s joined\n",name)

	//main message loop
	for {
		message, err := reader.ReadString('\n')
		if err != nil{
			fmt.Printf("User %s left \n", name)
			return
		}
		message = strings.TrimSpace(message)
		if message == ""{
			continue //skip empty message 
		}
		fmt.Printf("[%s]: %s\n", name, message)
	}

}