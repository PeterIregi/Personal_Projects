package converter

import (
	"strconv"
	"strings"
	//"unicode"
)

func ApplyUp(text string) string{
	words := strings.Fields(text)
	for i := 0; i <len(words); i++{
		if strings.HasPrefix(words[i], "(up"){
			cmd, num := ParseCommand(words[i])
			if cmd == "up" && i  > 0 {
				//Apply to num words before the marker
				start := i - num
				if start < 0 {
					start = 0
				}
				for j := start; j < i; j++{
					words[j] = strings.ToUpper(words[j])
				}
				//remove marker
				words = append( words[:i], words[i+1:]...)
				i--
			}
		}
	}
	return strings.Join(words, " ")
}

func ApplyLow( text string)string{
	words := strings.Fields(text)
	for i := 0; i < len(words); i++{
		if strings.HasPrefix(words[i], "(low"){
			cmd, num := ParseCommand(words[i])
			if cmd == "low" && i > 0{
				start := i -num
				if start <0 {
					start = 0
				}
				for j := start; j < i; j++{
					words[j] = strings.ToLower(words[j])
				}
				words = append(words[:i], words[i+1:]...)
			}
		}
	}
	return strings.Join(words, " ")
}

func ParseCommand( marker string)(command string, number int){
	//remove parantheses
	content := strings.Trim(marker, "()")

	//split by comma
	parts := strings.Split(content, ",")
	command = strings.TrimSpace(parts[0])

	number = 1 
	if len(parts)>1{
		num, err := strconv.Atoi(strings.TrimSpace(parts[1]))
		if err == nil && num > 0{
			number = num
		}
	}
	return command, number
}
//before we continue any further lets find out why  it says undefined when oi have defined the functions 
//later