package converter

import(
	"testing"
)

func TestConvertHex(t *testing.T){
	tests := []struct{
		name string
		input string
		expected string
	}{
		{
			name: "simple hex conversion",
			input: "1E (hex) files were added",
			expected: "30 files were added",
		},
		{
			name: "multiple hex conversions",
			input: "FF (hex) and 1E (hex) are hex numbers",
			expected: "255 and 30 are hex numbers",
		},
		{
			name: "hex at beginning",
			input: "1E (hex) files",
			expected: "30 files",
		},
		{
			name: "hex at end",
			input: "The value is FF (hex)",
			expected: "The value is 255",
		},
		{
			name: "no hex marker",
			input: "This has no hex",
			expected: "This has no hex",
		},
		{
			name: "invalid hex number",
			input: "ZZ (hex) is invalid",
			expected: "ZZ (hex) is invalid",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name,func(t *testing.T){
			result := ConvertHex(tt.input)
			if result != tt.expected{
				t.Errorf("convertHex(%q) = %q, want %q", tt.input, result, tt.expected)
			}
		})
	}

}


//now to test for convert from binary to decimal

func TestConvertBin(t *testing.T){
	tests := []struct{
		name string
		input string
		expected string
	}{
		{
			name: "Simple binary conversion",
			input: "It has been 10 (bin) years",
			expected: "It has been 2 years",
		},
		{
			name: "Multiple binary conversions",
			input: "1010 (bin) and 1111 (bin) are binary",
			expected: "10 and 15 are binary",
		},
		{
			name: "Binary with leading zeros",
			input: "0010 (bin) is 2",
			expected: "2 is 2",
		},
		{
			name: "no binary markers",
			input: "Just normal text",
			expected: "Just normal text",
		},
		{
			name: "invalid binary",
			input: "102 (bin) is invalid",
			expected: "102 (bin) is invalid",
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T){
			result := ConvertBin(tt.input)
			if result != tt.expected {
				t.Errorf("ConvertBin(%q) = %q, want %q", tt.input, result, tt.expected)
			}
		})
	}
}
func TestFindHexMarkers(t *testing.T){
	tests:= []struct{
		name string
		input string
		expected int //number of markers if any
	}{
		{"no markers","hello world",0},
		{"one marker","1E (hex) world",1},
		{"two markers","FF (hex) and 1E (hex)", 2},
	}
	for _,tt := range tests{
		t.Run(tt.name, func(t *testing.T){
			result:=FindHexMarkers(tt.input)
			if len(result) != tt.expected {
				t.Errorf("FindMarkers(%q) found %d markers, want %d",tt.input, result, tt.expected)
			}
		})
	}
}

//it says we have not defined our functions 
//we will do that later
//before we do that we should be able to identify hex marker and maybe bin markers for conversion lets put a test for that 
