package main

import(
	"fmt"
	"time"
	"sync"
)

var counter int
var wg sync.WaitGroup
var mutex sync.Mutex 
func increment(){
	mutex.Lock()
	counter++
	fmt.Println("Incrimented to ", counter)
	mutex.Unlock()
}

func sayHello(){
	fmt.Println("Hello from Goroutine")
}

func worker(id int, wg *sync.WaitGroup){
	defer wg.Done()
	fmt.Printf("Worker %d starting \n", id)
	time.Sleep(200*time.Millisecond)
	fmt.Printf("Worker %d done \n", id)
}

func printMessage(msg string){
	fmt.Println(msg)
}
func  main(){
	go sayHello()
	time.Sleep(1000*time.Millisecond)
	fmt.Println("Hello from main")

	for i  := 1;i <= 3; i++{
		go worker(i, wg)
	}
	time.Sleep(2*time.Second)
	fmt.Println("All workers completed")

	go func(){
		fmt.Println("Running in goroutine")
	} ()

	time.Sleep(100*time.Millisecond)
	fmt.Println("Running in main")
	

	go printMessage("First Message")
	go printMessage("Second Message")

	time.Sleep(100 * time.Millisecond)
	fmt.Println("Main Message")

	for i := 0; i<5; i++{
		wg.Add(1)
		go func(){
			defer wg.Done()
			increment()
		} ()
	}
	wg.Wait() //for all goroutines to complete
	fmt.Println("Final counter:", counter)


	for i := 1; i <= 3; i++{
		wg.Add(1)
		go worker(i,&wg)
	}

}