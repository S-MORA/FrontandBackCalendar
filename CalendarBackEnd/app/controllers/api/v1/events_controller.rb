module Api
  module V1
    class EventsController < ApplicationController

      def index
        events = Event.order('created_at ASC')
        render json: {status: 'Successful!', message:'Loaded Events!', data:events}, status: :ok
      end

      def create
        event = Event.new(event_params)
        if event.save
          render json: {status: 'Successful!', message:'Event Saved', data:event}, status: :ok
        else
          render json: {status: 'ERROR!', message:'Event not Saved', data:event.errors}, status: :unprocessable_entity
        end
      end

     def destroy
       event = Event.find(params[:id])
       event.destroy
       render json: {status: 'Success!', message:'Event Deleted', data:event}, status: :ok
     end

      private
      def event_params
       params.permit(:title, :start_time, :end_time, :date)
      end

    end
  end
end
