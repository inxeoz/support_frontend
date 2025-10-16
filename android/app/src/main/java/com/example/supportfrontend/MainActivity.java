//package com.example.supportfrontend;
//
//import com.getcapacitor.BridgeActivity;
//
//public class MainActivity extends BridgeActivity {}


package com.example.supportfrontend;

import android.os.Bundle;
import androidx.core.view.WindowCompat;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        // Make sure to call before super.onCreate if you want the initial layout to respect insets immediately
        // but calling after is also fine in most cases
        super.onCreate(savedInstanceState);

        // Tell the window to fit system windows (so layout will NOT draw behind status bar)
        // true => window will inset content so it does not overlap system bars
        WindowCompat.setDecorFitsSystemWindows(getWindow(), true);

        // Optional: set status bar color (uncomment to use)
        // getWindow().setStatusBarColor(Color.parseColor("#ffffff")); // or Color.TRANSPARENT
    }
}
