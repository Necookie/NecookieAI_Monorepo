plugins {
    id("com.android.application")
}

// Set this in ~/.gradle/gradle.properties or pass -PappHost=chat.your-domain.com.
// A required host prevents accidentally shipping an app pointed at a sample site.
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
        versionCode = 1
        versionName = "0.1.0"
        manifestPlaceholders["appHost"] = appHost
        manifestPlaceholders["launchUrl"] = "https://$appHost/"
        val assetStatements = """[{"relation":["delegate_permission/common.handle_all_urls"],"target":{"namespace":"web","site":"https://$appHost"}}]"""
        resValue("string", "asset_statements", assetStatements.replace("\"", "\\\""))
    }

    buildTypes {
        release {
            // Signing is intentionally supplied by the release owner, outside source control.
            isMinifyEnabled = false
        }
    }
}

dependencies {
    implementation("com.google.androidbrowserhelper:androidbrowserhelper:2.7.3")
}
