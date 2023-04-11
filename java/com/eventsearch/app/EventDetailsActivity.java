package com.eventsearch.app;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.fragment.app.Fragment;
import androidx.viewpager2.adapter.FragmentStateAdapter;
import androidx.viewpager2.widget.ViewPager2;

import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.TextView;

import com.google.android.material.tabs.TabLayout;
import com.google.android.material.tabs.TabLayoutMediator;

public class EventDetailsActivity extends AppCompatActivity {

    private TabLayout tabLayout;
    private ViewPager2 viewPager;
    private Event selectedEvent;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_event_details);
        selectedEvent = getIntent().getParcelableExtra("selected_event");

        TextView backButton = findViewById(R.id.back_to_eventlist);
        backButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                finish();
            }
        });

        tabLayout = findViewById(R.id.tabLayout3);
        viewPager = findViewById(R.id.viewPager3);

        viewPager.setAdapter(new FragmentStateAdapter(this) {
            @NonNull
            @Override
            public Fragment createFragment(int position) {
                // Return the fragment for the corresponding tab.
                switch (position) {
                    case 0:
                        EventDetailsFragment eventDetailsFragment  = new EventDetailsFragment();
                        Bundle bundle = new Bundle();
                        bundle.putParcelable("selected_event", selectedEvent);
                        eventDetailsFragment.setArguments(bundle);
                        return  eventDetailsFragment;
                    case 1:
                        return new ArtistFragment();
                    case 2:
                        return new VenueFragment();
                    default:
                        return null;
                }
            }

            @Override
            public int getItemCount() {
                return 3;
            }
        });

        new TabLayoutMediator(tabLayout, viewPager, (tab, position) -> {
            // Set the text for the tabs.
            switch (position) {
                case 0:
                    tab.setText("DETAILS");
                    break;
                case 1:
                    tab.setText("ARTIST(S)");
                    break;
                case 2:
                    tab.setText("VENUE");
                    break;
            }
        }).attach();

        tabLayout.addOnTabSelectedListener(new TabLayout.OnTabSelectedListener() {
            @Override
            public void onTabSelected(TabLayout.Tab tab) {
                Log.d("EventDetailsActivity", "onTabSelected: " + tab.getPosition());
                viewPager.setCurrentItem(tab.getPosition());
            }

            @Override
            public void onTabUnselected(TabLayout.Tab tab) {

            }

            @Override
            public void onTabReselected(TabLayout.Tab tab) {

            }
        });

    }


}