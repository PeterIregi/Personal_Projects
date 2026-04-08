package converter

import (
	"testing"
)

func TestApplyUp(t *testing.T) {
	tests := []struct {
		name     string
		input    string
		expected string
	}{
		{
			name:     "single word uppercase",
			input:    "Ready, set, go (up) !",
			expected: "Ready, set, GO !",
		},
		{
			name:     "multiple words with number",
			input:    "This is so exciting (up, 2)",
			expected: "This is SO EXCITING",
		},
		{
			name:     "up at beginning",
			input:    "(up) hello world",
			expected: "HELLO world", // Should this be the behavior? Test fails first!
		},
		{
			name:     "no markers",
			input:    "normal text",
			expected: "normal text",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := ApplyUp(tt.input)
			if result != tt.expected {
				t.Errorf("ApplyUp(%q) = %q, want %q", tt.input, result, tt.expected)
			}
		})
	}
}

func TestApplyLow(t *testing.T) {
	tests := []struct {
		name     string
		input    string
		expected string
	}{
		{
			name:     "single word lowercase",
			input:    "I should stop SHOUTING (low)",
			expected: "I should stop shouting",
		},
		{
			name:     "multiple words with number",
			input:    "MAKE THIS QUIET (low, 2)",
			expected: "MAKE this quiet",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := ApplyLow(tt.input)
			if result != tt.expected {
				t.Errorf("ApplyLow(%q) = %q, want %q", tt.input, result, tt.expected)
			}
		})
	}
}

func TestApplyCap(t *testing.T) {
	tests := []struct {
		name     string
		input    string
		expected string
	}{
		{
			name:     "single word capitalize",
			input:    "Welcome to the Brooklyn bridge (cap)",
			expected: "Welcome to the Brooklyn Bridge",
		},
		{
			name:     "multiple words with number",
			input:    "this is a test (cap, 2)",
			expected: "this Is A test",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := ApplyCap(tt.input)
			if result != tt.expected {
				t.Errorf("ApplyCap(%q) = %q, want %q", tt.input, result, tt.expected)
			}
		})
	}
}

func TestParseCommand(t *testing.T) {
	tests := []struct {
		name          string
		marker        string
		wantCommand   string
		wantNumber    int
	}{
		{"simple up", "(up)", "up", 1},
		{"up with number", "(up, 2)", "up", 2},
		{"low with number", "(low, 5)", "low", 5},
		{"cap with number", "(cap, 3)", "cap", 3},
		{"with spaces", "(up,  2)", "up", 2},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			cmd, num := ParseCommand(tt.marker)
			if cmd != tt.wantCommand || num != tt.wantNumber {
				t.Errorf("ParseCommand(%q) = (%q, %d), want (%q, %d)", 
					tt.marker, cmd, num, tt.wantCommand, tt.wantNumber)
			}
		})
	}
}
//lets amake the functions to make the test pass
