package main

import(
	"fmt"
	//"sync"
	"time"
)
 func produceMessages(ch chan <- string){
	for i  := 0; i < 5; i++{
		ch <- fmt.Sprintf("Message %d", i)
	}
	close(ch)
 }

 func SayHello(name string){
	fmt.Println("Hello", name)
 }

 func main(){
	ch := make (chan string)

	go produceMessages(ch)

	for msg := range ch {
		fmt.Println("Recieved:", msg)
	}

	fmt.Println("All messages recieved")

	go SayHello("Alice")
	go SayHello("Bob")

	time.Sleep(time.Second)

 }