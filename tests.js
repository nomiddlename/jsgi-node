require.paths.unshift("./spec/lib", "./lib");
require("jspec");

var sys = require("sys"), fs = require("fs");

quit = process.exit
print = sys.puts

readFile = function(path) {
  try {
    return fs.readFileSync(path);
  } catch (e) {
    throw new Error("Could not load file "+path);
  }
}

var specsFound = false;

if (process.ARGV[2]) {
  specsFound = true;
  JSpec.exec('spec/spec.' + process.ARGV[2] + '.js');
} else {
  var files = fs.readdirSync('spec/');  
  files.filter(
    function (file) { 
      return file.indexOf('spec.') === 0; 
    }
  ).forEach(
    function(file) {
        specsFound = true;
        JSpec.exec('spec/'+file);
      }
  );
}
if (specsFound) {
  JSpec.run({ reporter: JSpec.reporters.Terminal });
  JSpec.report();
} else {
  print("No tests to run. This makes me sad.");
}

