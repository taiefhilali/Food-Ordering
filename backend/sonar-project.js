// const { sonarqubeScanner } = require('sonarqube-scanner');

// sonarqubeScanner({
//     serverUrl: 'http://172.10.0.140:9000',
//     options: {
//         'sonar.login': '44b3ef6161f80bc0c05d08f070026f438b734e9e',
//         'sonar.projectKey': 'quickbite',
//         'sonar.sources': '.',
//         'sonar.tests': '.',
//         'sonar.inclusions': 'index.ts', 
//         'sonar.test.inclusions': 'tests/*',
//         'sonar.javascript.lcov.reportPaths': './coverage/lcov.info'
//     }
// }, () => {
//     console.log('SonarQube scan completed');

// });

const scanner = require('sonarqube-scanner').default;

scanner(
  {
    serverUrl: 'http://192.168.56.10:9000',
    token: '10e49f83555486520d15689dfb5c0910d8729e35',
    options: {
      'sonar.projectName': 'quickbite',
      'sonar.projectDescription': 'quickbite',
      'sonar.sources': 'backend/src/*',
      'sonar.tests': 'backend/tests/*',
    },
  },
  error => {
    if (error) {
      console.error(error);
    }
    process.exit();
  },
);