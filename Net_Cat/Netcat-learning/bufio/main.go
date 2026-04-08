package main


import(
	"fmt"

)

func main(){
	ch := make (chan string) //create a channel of strings

	//send in one go routine

	go func(){
		ch <- "This is just a test"
	}()
	go func(){
		ch <- "Hello from goroutine!" //sent to the channel 
	}()
	go func(){
		ch <- "This is also a test"
	}()
	go func(){
		ch <- "This is from another goroutine"
		
	}()
	

	//Recieve in main
	/*msg, msg2, msg3, msg4 := <- ch ,<- ch ,<- ch, <-ch//Recieve from the channel
	fmt.Println(msg)
	fmt.Println(msg2)
	fmt.Println(msg3)
	fmt.Println(msg4)
	*/
	for m := range (ch){
		fmt.Println(m)
	}
	close(ch)
}