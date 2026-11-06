plugins {
    id("com.android.application")
}

// Defaults to chat.necookie.dev in gradle.properties. Override for staging.
val appHost = providers.gradleProperty("appHost").orNull
    ?: throw GradleException("Set appHost to your deployed HTTPS hostname (for example -PappHost=chat.your-domain.com).")
require(appHost.length <= 253 && appHost.matches(Regex("(?=.{1,253}$)(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\\.)+[a-zA-Z](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?"))) {
    "appHost must be a DNS hostname only, without a scheme, port, or path."
}

android {
    namespace = "dev.necookie.ai"
    compileSdk = 36

    defaultConfig {
        applicationId = "dev.necookie.ai"
        minSdk = 23
        targetSdk = 36
        versionCode = providers.gradleProperty("androidVersionCode").orElse("1").get().toInt()
        versionName = providers.gradleProperty("androidVersionName").orElse("0.1.0").get()
        manifestPlaceholders["appHost"] = appHost
        manifestPlaceholders["launchUrl"] = "https://$appHost/"
        val assetStatements = """[{"relation":["delegate_permission/common.handle_all_urls"],"target":{"namespace":"web","site":"https://$appHost"}}]"""
        resValue("string", "asset_statements", assetStatements.replace("\"", "\\\""))
    }

    val releaseStore = providers.environmentVariable("ANDROID_KEYSTORE_PATH").orNull
    if (releaseStore != null) {
        signingConfigs.create("release") {
            storeFile = file(releaseStore)
            storePassword = providers.environmentVariable("ANDROID_STORE_PASSWORD").get()
            keyAlias = providers.environmentVariable("ANDROID_KEY_ALIAS").orElse("necookie").get()
            keyPassword = providers.environmentVariable("ANDROID_KEY_PASSWORD").get()
        }
    }

    buildTypes {
        release {
            signingConfig = signingConfigs.findByName("release")
            isMinifyEnabled = false
        }
    }
}

dependencies {
    implementation("com.google.androidbrowserhelper:androidbrowserhelper:2.7.3")
}
