//lets make the converter
package converter

import (
	"strconv"
	"strings"
)

//convert hex to decimal
func ConvertHex(text string) string{
	words:= strings.Fields(text)
	for i := 0; i< len(words); i++{
		if words[i]== "(hex)" && i > 0{
			//convert previous word from hex to decimal
			hexNum:= words[i-1]//fix from plus to minus to convert the previous word an dnot the next word and move on the + 1 is what brings the out of range error
			
			decimal,err := strconv.ParseInt(hexNum,16,64)
			if err == nil{
				words[i-1]= strconv.FormatInt(decimal,10)
				//remove (hex) marker
				words = append( words [:i], words[i+1:]...)
				i-- //adjust index after removal
			}
		}
	}
	return strings.Join(words, " ")
}

//convert Binary to decimal

func ConvertBin(text string)string{
	words := strings.Fields(text)
	for i := 0; i < len(words); i ++{
		if words [i] == "(bin)" && i > 0{
			//convert the previous word from binary to decimal
			binNum := words[i-1]
			decimal, err := strconv.ParseInt(binNum,2, 64)
			if err == nil {
				words[i-1]= strconv.FormatInt(decimal,10)
				//remove the (bin) marker
				words= append(words[:i],words[i+1:]...)
				i-- 
			}
		}
	}
	return strings.Join(words," ")
}

func FindHexMarkers(text string)[]int {
	var indices []int
	words := strings.Fields(text)
	for i, word := range words{
		if word == "(hex)"{
			indices = append(indices,i)
		}
	}
	return indices
}


//we will continue tomorrow
//lets continue
//it doesnt work it fails we will attempt to fixit 
//when weleft the test were failing lets see why
//the error was in our function it was converting the word that was after the hex marker 

//lets fix that and see what happens
//now the tests should pass
//as was expected/
//now lets  convert some uper case words to lowercase and vice versa but first the test
