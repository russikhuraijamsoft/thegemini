const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const keystoreDir = path.join(__dirname, '../android/app/keystore');
if (!fs.existsSync(keystoreDir)) {
  fs.mkdirSync(keystoreDir, { recursive: true });
}

const keystorePath = path.join(keystoreDir, 'release.jks');

if (process.env.ANDROID_KEYSTORE_BASE64) {
  console.log('Writing production keystore from environment secret...');
  fs.writeFileSync(keystorePath, Buffer.from(process.env.ANDROID_KEYSTORE_BASE64, 'base64'));
} else if (!fs.existsSync(keystorePath)) {
  console.log('Generating production-ready RSA 2048-bit release keystore...');
  execSync(
    `keytool -genkeypair -v -keystore "${keystorePath}" -alias talkos -keyalg RSA -keysize 2048 -validity 10000 -storepass talkos1234 -keypass talkos1234 -dname "CN=TalkOS, OU=Restaurant ERP, O=Talk of the Town, L=Imphal, ST=Manipur, C=IN"`,
    { stdio: 'inherit' }
  );
}

const gradlePath = path.join(__dirname, '../android/app/build.gradle');
if (fs.existsSync(gradlePath)) {
  let content = fs.readFileSync(gradlePath, 'utf8');
  if (!content.includes('signingConfigs.release')) {
    const signingSnippet = `
android {
    signingConfigs {
        release {
            storeFile file('keystore/release.jks')
            storePassword System.getenv('KEYSTORE_PASS') ?: 'talkos1234'
            keyAlias System.getenv('KEY_ALIAS') ?: 'talkos'
            keyPassword System.getenv('KEY_PASS') ?: 'talkos1234'
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
        }
    }
}
`;
    fs.appendFileSync(gradlePath, signingSnippet);
    console.log('Injected release signing configuration into android/app/build.gradle');
  }
} else {
  console.log('android/app/build.gradle not found yet (will be created by cap add android).');
}
