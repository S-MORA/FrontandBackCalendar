require_relative 'boot'

require "rails"
# Pick the frameworks you want:
require "active_model/railtie"
require "active_job/railtie"
require "active_record/railtie"
require "active_storage/engine"
require "action_controller/railtie"
require "action_mailer/railtie"
require "action_view/railtie"
require "action_cable/engine"
require "rails/test_unit/railtie"


Bundler.require(*Rails.groups)

module CalenderBackEnd
  class Application < Rails::Application
    # Initialize configuration defaults for originally generated Rails version.

    config.middleware.insert_before 0, Rack::Cors do
      allow do
        origins '*'
        resource '*', headers: :any, methods: [:get, :post, :delete,]
      end
    end
    config.load_defaults 5.2
    config.api_only = true
  end
end
