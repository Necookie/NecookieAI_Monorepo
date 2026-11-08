package dev.necookie.ai;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;

import android.app.Application;
import android.content.ComponentName;
import android.content.pm.ActivityInfo;
import android.content.pm.PackageManager;
import com.google.androidbrowserhelper.trusted.ManageDataLauncherActivity;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.robolectric.RobolectricTestRunner;
import org.robolectric.RuntimeEnvironment;
import org.robolectric.annotation.Config;

@RunWith(RobolectricTestRunner.class)
@Config(sdk = {28, 34})
public class StartupTest {
    @Test
    public void launcherCanUpdateSiteSettingsComponent() throws Exception {
        Application app = RuntimeEnvironment.getApplication();
        PackageManager pm = app.getPackageManager();
        ComponentName component = new ComponentName(app, ManageDataLauncherActivity.class);
        ActivityInfo info = pm.getActivityInfo(component, PackageManager.GET_META_DATA);
        assertFalse(info.exported);
        assertEquals(component.getClassName(), pm.getApplicationInfo(
                app.getPackageName(), 0).manageSpaceActivityName);
        ActivityInfo launcher = pm.getActivityInfo(new ComponentName(app,
                "com.google.androidbrowserhelper.trusted.LauncherActivity"),
                PackageManager.GET_META_DATA);
        assertEquals(launcher.metaData.getString("android.support.customtabs.trusted.DEFAULT_URL"),
                info.metaData.getString("android.support.customtabs.trusted.MANAGE_SPACE_URL"));

        // LauncherActivity calls this on every cold launch, even without a TWA provider.
        // Android throws IllegalArgumentException if the component was never declared.
        ManageDataLauncherActivity.addSiteSettingsShortcut(app, null);
        assertEquals(PackageManager.COMPONENT_ENABLED_STATE_DISABLED,
                pm.getComponentEnabledSetting(component));
    }
}
