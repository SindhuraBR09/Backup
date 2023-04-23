package com.eventsearch.app;
import android.content.Intent;
import android.text.TextUtils;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.recyclerview.widget.RecyclerView;
import java.util.List;
import com.bumptech.glide.Glide;

public class Eventlist_Adapter extends RecyclerView.Adapter<Eventlist_Adapter.EventViewHolder> {

    private List<Event> mEvents;

    public Eventlist_Adapter(List<Event> events) {
        this.mEvents = events;
    }

    public List<Event> getEvents(){
        return mEvents;
    }

    // This method is called when a new ViewHolder is needed
    @Override
    public Eventlist_Adapter.EventViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        // Create a new view
        View v = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.eventlist_row, parent, false);

        // Create a new ViewHolder
        EventViewHolder viewHolder = new EventViewHolder(v);

        return viewHolder;
    }

    // This method is called to display the data in each view
    @Override
    public void onBindViewHolder(EventViewHolder holder, int position) {
        Event event = mEvents.get(position);


        // Set the data for the views
        holder.mEventName.setText(event.getName());
        holder.mDate.setText(event.getDate());
        holder.mTime.setText(event.getTime());
        holder.mVenueName.setText(event.getVenue());
//        holder.mGenres.setText(TextUtils.join(", ", event.getGenres()));
        holder.mGenres.setText("Test");
        // Load the image into the ImageView using Glide or another image loading library
        Glide.with(holder.mImageView.getContext())
                .load(event.getImageUrl())
                .into(holder.mImageView);

        if(HomeActivity.favoriteEvents.containsKey(event.getId())){
            holder.mFvtButton.setImageResource(R.drawable.heart_filled);
        }
        else{
            holder.mFvtButton.setImageResource(R.drawable.heart_outline);
        }
    }

    // This method returns the number of items in the list
    @Override
    public int getItemCount() {
        return mEvents.size();
    }

    // This class is the ViewHolder that holds the views for each item
    public class EventViewHolder extends RecyclerView.ViewHolder {
        public ImageView mImageView;
        public TextView mEventName;
        public TextView mDate;
        public TextView mTime;
        public TextView mVenueName;
        public TextView mGenres;

        public ImageButton mFvtButton;

        public ConstraintLayout mRowLayout;

        public EventViewHolder(View v) {
            super(v);
            mImageView = v.findViewById(R.id.imageView);
            mEventName = v.findViewById(R.id.nameTextView);
            mDate = v.findViewById(R.id.dateTextView);
            mTime = v.findViewById(R.id.timeTextView);
            mVenueName = v.findViewById(R.id.venueTextView);
            mGenres = v.findViewById(R.id.genreTextView);
            mFvtButton = v.findViewById(R.id.fvtButton);

            mRowLayout = v.findViewById(R.id.event_row);
            mRowLayout.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View view) {
                    int position = getAdapterPosition();
                    Log.d("EventViewHolder", "Event Clicked "+position);
                    if (position != RecyclerView.NO_POSITION) {
                        Event clickedEvent = mEvents.get(position);
                        Intent intent = new Intent(view.getContext(), EventDetailsActivity.class);
                        intent.putExtra("selected_event", clickedEvent);
                        view.getContext().startActivity(intent);
                    }
                }
            });

            mFvtButton.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View view) {
                    Log.d("EventListAdapter: ", "Fvt clicked");
                    int position = getAdapterPosition();
                    if (position != RecyclerView.NO_POSITION) {
                        Event clickedEvent = mEvents.get(position);
                        Log.d("EventListAdapter  Adding to Favts: ",clickedEvent.getName());
//                        HomeActivity.favoriteEvents.put(clickedEvent.getId(), clickedEvent);
                        if(HomeActivity.favoriteEvents.containsKey(clickedEvent.getId())){
                            HomeActivity.favoriteEvents.remove(clickedEvent.getId());
                            mFvtButton.setImageResource(R.drawable.heart_outline);
                        } else {
                            HomeActivity.favoriteEvents.put(clickedEvent.getId(), clickedEvent);
                            mFvtButton.setImageResource(R.drawable.heart_filled);
                        }
                    }
                }
            });
        }
    }
}
