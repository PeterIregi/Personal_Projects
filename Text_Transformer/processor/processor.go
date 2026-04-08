//we need two functions a readfile and a write file function

package processor

import (
	"os"

)

func ReadFile(filename string) (string, error){
	data,err := os.ReadFile(filename)
	//reads file and if not able to returns an empty string and the error thrown when attempting to read the file
	if err != nil{
		return "", err
	}
	//if able to read the file return the content and nil
	return string(data), nil
}

func WriteFile(filename, content string) error{
	//writes to the file and if not able will give out a non nill err value 
	return os.WriteFile(filename, []byte(content),0644)
}

//it should compile but fail for obvious reasons
//good it fails now lets try to make it pass
//lets try it now
//we deal with something else later