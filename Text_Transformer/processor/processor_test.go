//lets try to build a text transformation program and as usual we start with the test 
//lets get started
package processor

import(
	"os"
	"testing"
	"path/filepath"
)

func TestReadFile(t *testing.T){
	//create a temporary directory for test files
	tmpDir := t.TempDir()

	//create a test file
	testContent := "Hello, This is a test file!"
	testFile := filepath.Join(tmpDir, "test.txt")
	err := os.WriteFile(testFile,[]byte(testContent), 0644)

	if err != nil{
		t.Fatalf("Failed to create test file: %v", err)
	}

	//test reading the file
	content,err := ReadFile(testFile)
	if err != nil{
		t.Errorf("ReadFile returned error: %v", err)
	}
	if content != testContent {
		t.Errorf("ReadFile returned %q, want %q", content, testContent)
	}

	//Test reading non-existent file
	_, err = ReadFile(filepath.Join(tmpDir, "nonexistent.txt"))
	if err ==nil{
		t.Error("Readfile should return error for non-existent file, got nil")
	}
}
func TestWriteFile(t *testing.T){
	tmpDir :=t.TempDir()
	outputFile := filepath.Join(tmpDir, "output.txt")
	testContent := "This will be written to a file"

	//Test writting file
	err := WriteFile(outputFile, testContent)
	if err != nil{
		t.Errorf("WriteFile returned error: %v", err)
	}

	//verify file was written correctly
	content, err := os.ReadFile(outputFile)
	if err != nil{
		t.Fatalf("Failed to read written file: %v", err)
	}

	if string(content) != testContent {
		t.Errorf("File contains %q, want %q", string(content), testContent)
	}

	//Test writting to invalid location (should error)
	err = WriteFile("/invalid/path/file.txt", testContent)
	if err == nil{
		t.Error("WriteFile should return error for invalid path, got nil")
	}
}
 
//the test will not compile because of some obvious errors like the fact that we have not created the file to be testes we will do that later
//lets try to make a file that will make the test pass
